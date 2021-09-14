#!/usr/bin/env python
"""globe_update.py
Updates the GeoDa Downloads Page Globe by updating the down_by_country.csv
file with the 'country' info from the google analytics API.
Will fill in for any missing points from the last updated date"""

from googleapiclient.discovery import build
from google.oauth2 import service_account
from datetime import date
import calendar, sys, csv, json, os

#Declaring the name of each month, and the month of each name
MONTH_TO_TEXT = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}
TEXT_TO_MONTH = {
  'Jan': 1,
  'Feb': 2,
  'Mar': 3,
  'Apr': 4,
  'May': 5,
  'Jun': 6,
  'Jul': 7,
  'Aug': 8,
  'Sep': 9,
  'Oct': 10,
  'Nov': 11,
  'Dec': 12
}

#API specifics information
SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
VIEW_ID = '115222200'
#KEY_FILE_LOCATION = 'client_secrets.json'


def get_month_range(year, month):
  """Gets the start date and end date of the current month

  Args:
    year: An integer representing the current year
    month: An integer representing the current month
  Returns:
    A tuple of two dates containing the start date and end date of the month respectively 
  """

  #Getting the number of days in the month
  endDay = calendar.monthrange(year, month)[1]

  #Creating start and end dates
  startDate = date(year, month, 1)
  endDate = date(year, month, endDay)

  #prints the chosen dates
  print("Start Date: " + str(startDate) + "\nEnd Date: " + str(endDate))

  #Returns the date ranges
  return (startDate, endDate)


def initialize_analyticsreporting():
  """Initializes an Analytics Reporting API V4 service object.

  Returns:
    An authorized Analytics Reporting API V4 service object.
  """
  ACCOUNT_INFO = os.environ['ACCOUNT_INFO']

  credentials = service_account.Credentials.from_service_account_info(
    json.loads(ACCOUNT_INFO),
    scopes=SCOPES)

  # Build the service object.
  analytics = build('analyticsreporting', 'v4', credentials=credentials)

  return analytics


def get_report(analytics, dateRange):
  """Queries the Analytics Reporting API V4.

  Args:
    analytics: An authorized Analytics Reporting API V4 service object.
    dateRange: A tuple of 2 date objects, containing the start date and end date respectively
  Returns:
    The Analytics Reporting API V4 response.
  """
  return analytics.reports().batchGet(
      body={
        'reportRequests': [
        {
          'viewId': VIEW_ID,
          'dateRanges': [{'startDate': str(dateRange[0]), 'endDate': str(dateRange[1])}],
          'metrics': [{'expression': 'ga:totalEvents'}],
          'dimensions': [{'name': 'ga:country'}]
        }]
      }
  ).execute()


def get_downloads(response, country_to_id):
  """Parses the Analytics Reporting API V4 response.

  Args:
    response: An Analytics Reporting API V4 response.
    country_to_id: A dictionary of country name to globe id string
  Returns:
    A tuple containing a dictionary of country ids to their download counts 
    and a dictionary of logged country names to their download counts
  """
  country_count = {}
  log_count = {}
  
  for report in response.get('reports', []):
    columnHeader = report.get('columnHeader', {})
    dimensionHeaders = columnHeader.get('dimensions', [])
    metricHeaders = columnHeader.get('metricHeader', {}).get('metricHeaderEntries', [])

    for row in report.get('data', {}).get('rows', []):
      dimensions = row.get('dimensions', [])
      dateRangeValues = row.get('metrics', [])

      for header, dimension in zip(dimensionHeaders, dimensions):
        print(header + ': ', dimension)

        for i, values in enumerate(dateRangeValues):
          for metricHeader, value in zip(metricHeaders, values.get('values')):
            print(str(metricHeader.get('name')) + ':', value)
            if dimension in country_to_id and value != None:
              country_count[country_to_id[dimension]] = value
            elif value != None:
              log_count[dimension] = value

  return (country_count, log_count)


def main():
  #Getting today's date
  today = date.today()
  
  #Getting the last update dates and logged counts
  last_update = ""
  country_log = {}
  with open('data/globe_log.json', 'r', encoding="utf8") as f:
    data = json.load(f)
    last_update = data['last_update']
    country_log = dict(data['logged_downloads'])
  lastUpdateMonth = TEXT_TO_MONTH[last_update[:3]]
  lastUpdateYear = int(last_update[3:])

  #Calculations for last month and year number for last month
  lastMonth = (today.month + 10) % 12 + 1
  lastMonthYear = today.year
  if today.month == 1:
    lastMonthYear -= 1  

  #Checks to see if the years and months aren't ahead or up to date already
  if lastUpdateYear > lastMonthYear:
    print("ERROR: down_by_country.csv's last updated year is greater than last month's year.\n  Data Year: " + 
          str(lastUpdateYear) + "\n  Last Month's Year: " + str(lastMonthYear))
    sys.exit("down_by_country.csv year is greater than last month's year")
  elif lastUpdateMonth > lastMonth and lastUpdateYear == today.year:
    print("ERROR: down_by_country.csv's last updated month is greater than last month.\n  Data Month: " + 
          MONTH_TO_TEXT[lastUpdateMonth] + str(lastUpdateYear) + "\n  Last Month: " + 
          MONTH_TO_TEXT[lastMonth] + str(lastMonthYear))
    sys.exit("down_by_country.csv month is greater than last month")
  elif lastUpdateMonth == lastMonth and lastUpdateYear == today.year:
    print("ERROR: The down_by_country.csv is already updated for the past month.\n  Data Month: " + 
          MONTH_TO_TEXT[lastUpdateMonth] + str(lastUpdateYear) + "\n  Last Month: " + 
          MONTH_TO_TEXT[lastMonth] + str(lastMonthYear))
    sys.exit("down_by_country.csv is already up to date")
  else:
    #Declaring the working month and years
    workingMonth = lastUpdateMonth
    workingYear = lastUpdateYear

    #Formula for the number of months needed to be updated
    monthsToUpdate = (today.year - lastUpdateYear) * 12 + today.month - lastUpdateMonth - 1
    print("Starting updating dates for " + str(monthsToUpdate) + " missing months...\n")

    #Loop through the number of months that needs to be updated
    for i in range(monthsToUpdate):
      #Adds one to the last updated month, checking for if the next month changes the year
      if workingMonth == 12:
        workingYear += 1
        workingMonth = 1
      else:
        workingMonth += 1

      #Getting the month range tuple of the current working date
      monthRange = get_month_range(workingYear, workingMonth)

      #Getting a dictionary of country to id number from world-110m-country-names.tsv
      country_to_id = {}
      with open("data/country_to_id.csv", 'r', encoding="utf8") as f:
        country_to_id = dict(csv.reader(f))

      #API stuff to get the data
      analytics = initialize_analyticsreporting()
      response = get_report(analytics, monthRange)
      downloads, log_count = get_downloads(response, country_to_id)

      #Reading the data csv file and adding the new downloads values to each country in downloads_data
      # for reference, downloads_data[i][0] is the id, downloads_data[i][1] is the data count
      # downloads is the dictionary of id to new downloads
      downloads_data = []
      with open('data/down_by_country.csv', 'r', encoding="utf8") as f:
        downloads_data = list(csv.reader(f))
        for i in range(len(downloads_data[1:])):
          #print(str(downloads_data[i+1][0]) + " : " + str(downloads.get(downloads_data[i+1][0])))
          if downloads_data[i+1][0] in downloads and downloads.get(downloads_data[i+1][0]) != None:
            downloads_data[i+1][1] = str(int(downloads_data[i+1][1]) + int(downloads.get(downloads_data[i+1][0])))

      #Looping through the log_count to add logged country counts to country_log
      for i in log_count:
        if i in country_log:
          country_log[i] = str(int(log_count.get(i)) + int(country_log.get(i)))
        else:
          country_log[i] = log_count.get(i)

      #Writing to down_by_country.csv to update the data
      with open('data/down_by_country.csv', 'w', newline='', encoding="utf8") as f:
        writer = csv.writer(f)
        writer.writerows(downloads_data)
      
      #Updating globe_log.json to have the correct date
      with open('data/globe_log.json', 'w', encoding="utf8") as f:
        log_data = {}
        log_data['last_update'] = MONTH_TO_TEXT[workingMonth] + str(workingYear)
        log_data['__comment'] = "Log starts from Jul2019. logged_downloads are the country downloads not included in the globe. unknown_ids are globe ID's that are not identified in country_to_id.csv"
        log_data['logged_downloads'] = country_log
        log_data['unknown_ids'] = ['52', '60', '48', '882', '638', '316', '312', '831', 
                                  '344', '258', '666', '999', '28', '446', '480', '470', 
                                  '462', '474', '520', '184', '383', '132', '174', '678', 
                                  '690', '136', '702', '212', '175', '662', '438', '796', 
                                  '20', '660', '850', '990', '61', '29']
        json.dump(log_data, f, indent = 4)
        print("SUCCESS: down_by_country.csv is now updated for " + MONTH_TO_TEXT[workingMonth] + str(workingYear) + "! \n")

if __name__ == '__main__':
  main()

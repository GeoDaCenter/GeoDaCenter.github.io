"""update GeoDa download counts by querying Google Analytics GA4"""

import os
import sys
import csv
import json
import calendar
import datetime
from datetime import date
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    FilterExpression,
    Filter
)

# Declaring the name of each month, and the month of each name
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

GA4_PROPERTY_ID = "378644103"
GA4_ACCOUNT_CRED = os.environ['GA4_ACCOUNT_CRED']
GA4_EVENT_NAME = 'GeoDaDownload'
CRED_PATH = './data/credentials.json'

# create a temporary credential file
with open(CRED_PATH, 'w', encoding="utf8") as cred_file:
    cred_file.write(GA4_ACCOUNT_CRED)


def get_month_range(year, month):
    """Gets the start date and end date of the current month

    Args:
      year: An integer representing the current year
      month: An integer representing the current month
    Returns:
      A tuple of two dates containing the start date and end date of the month respectively 
    """

    # Getting the number of days in the month
    end_day = calendar.monthrange(year, month)[1]

    # Creating start and end dates
    start_date = date(year, month, 1)
    end_day = date(year, month, end_day)

    # prints the chosen dates
    print(f"Start Date: {start_date}")
    print(f"End Date: {end_day}")

    # Returns the date ranges
    return (start_date, end_day)


def get_last_month_year():
    """Get the last month and year from today"""
    today = date.today()
    first = today.replace(day=1)
    previous_month = first - datetime.timedelta(days=1)
    return previous_month.month, previous_month.year


def get_working_month_year(last_update_month, last_update_year):
    """Calculations for last month and year number for last month"""
    today = date.today()
    last_month, last_month_year = get_last_month_year()

    # Checks to see if the years and months aren't ahead or up to date already
    if last_update_year > last_month_year:
        print("ERROR: download_data.json's last updated year is greater than last month's year.")
        print(f"Data Year: {last_update_year}")
        print(f"Last Month's Year: {last_month_year}")
        sys.exit("download_data.json year is greater than last month's year")
    elif last_update_month > last_month and last_update_year == today.year:
        print("ERROR: download_data.json's last updated month is greater than last month.")
        print(
            f"Data Month: {MONTH_TO_TEXT[last_update_month]} {last_update_year}")
        print(f"Last Month: {MONTH_TO_TEXT[last_month]} {last_month_year}")
        sys.exit("download_data.json month is greater than last month")
    elif last_update_month == last_month and last_update_year == today.year:
        print("ERROR: The download_data.json is already updated for the past month.")
        print(
            f"Data Month: {MONTH_TO_TEXT[last_update_month]} {last_update_year}")
        print(f"Last Month: {MONTH_TO_TEXT[last_month]} {last_month_year}")
        sys.exit("download_data.json is already up to date")


def update_geoda_download_counts():
    """Runs a simple report on a Google Analytics 4 property."""
    download_data = []
    with open('data/download_data.json', encoding='utf8') as data_file:
        download_data = json.load(data_file)

    # For reference, downloadData[-1] is most recent data point of file,
    # [0] element is the date string, e.g. "Aug2005",
    # and [:3] is the substring of the month text, [3:] is the year number
    last_update_month = TEXT_TO_MONTH[download_data[-1][0][:3]]
    last_update_year = int(download_data[-1][0][3:])

    get_working_month_year(last_update_month, last_update_year)

    # Formula for the number of months needed to be updated
    today = date.today()
    working_month = last_update_month
    working_year = last_update_year
    months_to_update = (today.year - last_update_year) * \
        12 + today.month - last_update_month - 1
    print(f"Starting updating dates for {months_to_update} missing months...")

    # Loop through the number of months that needs to be updated
    for _ in range(months_to_update):
        # Adds one to the last updated month, checking for if the next month changes the year
        if working_month == 12:
            working_year += 1
            working_month = 1
        else:
            working_month += 1

        # Getting the month range tuple of the current working date
        start_date, end_date = get_month_range(working_year, working_month)

        # Queries the Analytics
        client = BetaAnalyticsDataClient.from_service_account_json(CRED_PATH)

        request = RunReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            date_ranges=[DateRange(start_date=str(start_date),
                                   end_date=str(end_date))],
        )
        response = client.run_report(request)

        download_counts = 0
        for row in response.rows:
            print(row)
            event_name = row.dimension_values[0].value
            if event_name == GA4_EVENT_NAME:
                download_counts = int(row.metric_values[0].value)

        # Calculating current month's downloads and name
        download_counts = download_data[-1][1] + download_counts
        date_str = MONTH_TO_TEXT[working_month] + str(working_year)

        # Adding new data to the download_data
        download_data.append([date_str, download_counts])
        print(
            f"SUCCESS: download_data.json is now updated for {date_str} downloads!")
        print(f"Total: {download_data[-1][1]}\n")

    # Writing new info to download_data.json
    with open('data/download_data.json', "w", encoding="utf8") as data_file:
        json.dump(download_data, data_file, indent=4)
    print(f"{months_to_update} missing months have been successfully updated!")


def update_geoda_globe():
    """Getting the last update date and logged counts by country"""
    today = date.today()

    last_update = ""
    country_log = {}

    with open('data/globe_log.json', 'r', encoding="utf8") as globe_log:
        data = json.load(globe_log)
        last_update = data['last_update']
        country_log = dict(data['logged_downloads'])

    last_update_month = TEXT_TO_MONTH[last_update[:3]]
    last_update_year = int(last_update[3:])

    get_working_month_year(last_update_month, last_update_year)

    # Formula for the number of months needed to be updated
    working_month, working_year = last_update_month, last_update_year
    months_to_update = (today.year - last_update_year) * 12 + \
        today.month - last_update_month - 1
    print(f"Starting updating dates for {months_to_update} missing months...")

    # Loop through the number of months that needs to be updated
    for _ in range(months_to_update):
        # Adds one to the last updated month, checking for if the next month changes the year
        if working_month == 12:
            working_year += 1
            working_month = 1
        else:
            working_month += 1

        # Getting the month range tuple of the current working date
        start_date, end_date = get_month_range(working_year, working_month)

        # Queries the Analytics
        client = BetaAnalyticsDataClient.from_service_account_json(CRED_PATH)

        request = RunReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            dimensions=[Dimension(name="countryId")],
            metrics=[Metric(name="eventCount")],
            date_ranges=[DateRange(start_date=str(start_date),
                                   end_date=str(end_date))],
            dimension_filter=FilterExpression(
                filter=Filter(
                    field_name="eventName",
                    string_filter=Filter.StringFilter(value=GA4_EVENT_NAME),
                )
            ),
        )
        response = client.run_report(request)

        download_by_country = {}
        for row in response.rows:
            country_id = row.dimension_values[0].value
            count = int(row.metric_values[0].value)
            download_by_country[country_id] = count

        # Reading the downloads data file and loops through new_downloads to update download_data
        # for reference, downloads_data[i][2] is the ISO code, downloads_data[i][1] is the data count
        # counted is a list of the ISO Codes that got counted
        downloads_data = []
        counted = []
        with open('data/down_by_country.csv', 'r', encoding="utf8") as country_file:
            downloads_data = list(csv.reader(country_file))
            for i in range(len(downloads_data[1:])):
                county_id, count, name = downloads_data[i + 1]
                if name in download_by_country and download_by_country.get(name) is not None:
                    new_count = int(count) + int(download_by_country[name])
                    downloads_data[i + 1] = [county_id, new_count, name]
                    counted.append(name)

        # Adding the not counted downloads to the country_log
        for name in download_by_country:
            if name not in counted and download_by_country.get(name) is not None:
                if name in country_log:
                    country_log[name] = str(
                        int(download_by_country.get(name)) + int(country_log.get(name)))
                else:
                    country_log[name] = download_by_country.get(name)

        # Writing to down_by_country.csv to update the data
        with open('data/down_by_country.csv', 'w', newline='', encoding="utf8") as out_file:
            writer = csv.writer(out_file)
            writer.writerows(downloads_data)

        # Updating globe_log.json to have the correct date
        with open('data/globe_log.json', 'w', encoding="utf8") as log_file:
            log_data = {}
            log_data['__comment'] = ("Log starts from Jul2019. logged_downloads are "
                                     "the country downloads not included in the globe.")
            log_data['last_update'] = f"{MONTH_TO_TEXT[working_month]}{working_year}"
            log_data['logged_downloads'] = country_log
            json.dump(log_data, log_file, indent=4)
            print(
                f"SUCCESS: down_by_country.csv is now updated for "
                f"{MONTH_TO_TEXT[working_month]}{working_year}!")


if __name__ == '__main__':
    update_geoda_globe()
    update_geoda_download_counts()

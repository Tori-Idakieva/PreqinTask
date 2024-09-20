import time
from flask import Flask
import csv

app = Flask(__name__)

@app.route('/api', methods=['GET'])
def get_data():
    data = []
    # get data from csv file and turn each line into dictionary - ideally that would be coming from a database
    with open('data.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if 'Commitment Amount' in row:
                row['Commitment Amount'] = int(row['Commitment Amount'])
            data.append(row)
    # get investors names removing any duplicates
    investors = list(set(item['Investor Name'] for item in data))

    sorted_data = []
    
    for name in investors:
        total = 0
        for item in data:
            if item['Investor Name'] == name:
                total = total + item['Commitment Amount']
        #  get all the static information for each investor
        # Investor Name,Investory Type,Investor Country,Investor Date Added,Investor Last Updated,
        investor_info = {
            'investory_type': next(item['Investory Type'] for item in data if item['Investor Name'] == name),
            'country': next(item['Investor Country'] for item in data if item['Investor Name'] == name),
            'date_added': next(item['Investor Date Added'] for item in data if item['Investor Name'] == name),
            'date_updated': next(item['Investor Last Updated'] for item in data if item['Investor Name'] == name),
            'total_investment': total
        }

        # get all of the investor's additional investment data
        # Commitment Asset Class,Commitment Amount,Commitment Currency
        investment_data = [
            {k.lower().replace(" ", "_"): item[k] for k in ['Commitment Asset Class', 'Commitment Amount', 'Commitment Currency']}
            for item in data if item['Investor Name'] == name
        ]
        
        sorted_data.append({
            'name': name,
            'investor_info': investor_info,
            'investment_data': investment_data
        })

    return {'data': sorted_data}

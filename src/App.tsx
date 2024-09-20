import { useState, useEffect } from 'react';
import './App.css';

interface InvestmentData {
  commitment_amount: number;
  commitment_asset_class: string;
  commitment_currency: string;
}

interface InvestorInfo {
  country: string;
  date_added: string;
  date_updated: string;
  investory_type: string;
  total_investment: number;
}

interface DataEntry {
  name: string;
  investor_info: InvestorInfo;
  investment_data: InvestmentData[];
}

type DataStructure = DataEntry[];

const InvestorTable = (props: { data: DataStructure }) => {
  const { data } = props;
  const [toggledIndex, setToggledIndex] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  const tableHeaders: string[] = [];
  const childTableHeaders: string[] = [];

  if (Array.isArray(data)) {
    tableHeaders.push('Investor Name');
    const headers: string[] = Object.keys(data[0].investor_info);
    headers.forEach((key) => {
      const item = key
        .replace(/_/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      tableHeaders.push(item);
    });
  
    const subHeaders: string[] = Object.keys(data[0].investment_data[0]);
    subHeaders.forEach((key) => {
      const item = key
        .replace(/_/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      childTableHeaders.push(item);
    });
  }

  const onMoreInfoClick = (index: number) => {
    setToggledIndex(toggledIndex === index ? null : index);
  };

  const onFilter = (filter: string) => {
    setFilterType(filter);
  }

  return (
    <table>
      <thead>
        <tr>
          {tableHeaders.map((el, index) => (
            <th key={index}>{el}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
            <>
              <tr key={index} onClick={() => onMoreInfoClick(index)}>
                <td>{entry.name}</td>
                <td>{entry.investor_info.country}</td>
                <td>{entry.investor_info.date_added}</td>
                <td>{entry.investor_info.date_updated}</td>
                <td>{entry.investor_info.investory_type}</td>
                <td>{entry.investor_info.total_investment} GBP</td>
                <td>
                  <button onClick={() => onMoreInfoClick(index)}>
                    {toggledIndex === index ? 'Hide Info' : 'More Info'}
                  </button>
                </td>
              </tr>
              {toggledIndex === index && (
                <>
                <div className="filter-container">
                  <span>Filters:</span>
                  <button onClick={() => onFilter('all')}>Show All</button>
                  <button onClick={() => onFilter('Hedge Funds')}>Hedge Funds</button>
                  <button onClick={() => onFilter('Private Equity')}>Private Equity</button>
                  <button onClick={() => onFilter('Real Estate')}>Real Estate</button>
                  <button onClick={() => onFilter('Infrastructure')}>Infrastructure</button>
                  <button onClick={() => onFilter('Natural Sources')}>Natural Sources</button>
                </div>
                <tr>
                  <td colSpan={tableHeaders.length}>
                    <table>
                      <thead>
                        <tr>
                          {childTableHeaders.map((el, index) => (
                            <th key={index}>{el}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {entry.investment_data.filter(investment => 
                        filterType === 'all' || investment.commitment_asset_class === filterType).map((investment, i) => 
                          (
                          <tr key={`${index}-${i}`}>
                            <td>{investment.commitment_asset_class}</td>
                            <td>{investment.commitment_amount}</td>
                            <td>{investment.commitment_currency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
                </>
              )}
            </>
          ))}
      </tbody>
    </table>
  );
};

function App() {
  const [investorData, setInvestorData] = useState<DataStructure>([]);

  const fetchMessage = async () => {
    try {
      const response = await fetch('/api');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setInvestorData(result.data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div style={{ width: "100vw" }}>
      <InvestorTable data={investorData} />
    </div>
  );
}

export default App;

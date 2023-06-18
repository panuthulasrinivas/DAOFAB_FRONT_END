import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//import Pagination from "react-js-pagination";
import { Pagination } from 'evergreen-ui'
function App() {
  const [transactions, setTransactions] = useState([])
  const [transaction, setTransaction] = useState([])
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, seTotalPages] = useState(0);
  const [isMain, setIsMain] = useState(true);
  const handlePageChange = (pageNumber) => {
    if (pageNumber <= totalPages) {
      setPageNo(pageNumber);
      fetachData(pageNumber, pageSize);
    }
  };
  const fetachData = (pageNo, pageSize) => {

    axios.get('http://localhost:8080/api/v0', {
      params: {
        pageNo: pageNo,
        pageSize: pageSize
      }
    })
      .then(res => {
        setTransactions(res.data.content);
        setPageNo(res.data.pageable.pageNumber);
        setPageSize(res.data.pageable.pageSize);
        seTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalElements);
      }).catch(function (error) {
        console.log(error);
      });
  }

  const setChild = (transaction) => {
    setTransaction(transaction);
    setIsMain(false);
  }

  const setMain = () => {
    setIsMain(true);
  }
  useEffect((pageNo, pageSize) => {
    fetachData(pageNo, pageSize);
  }, []);

  if (isMain) {
    //const render =(transactions) => {
    return (
      <div className='App'>
        <div className="App1">
          <table>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Total Amount</th>
              <th>Total Paid Amount</th>
            </tr>
            {transactions.map((tran) => {
              return (
                <tr key={tran.id}>
                  <td>{tran.id}</td>
                  <td>{tran.sender}</td>
                  <td>{tran.receiver}</td>
                  <td>{tran.totalAmount}</td>
                  <td><a onClick={() => setChild(tran)}>{tran.childTransactions && tran.childTransactions.reduce((a, v) => a = a + v.paidAmount, 0)
                  }</a></td>
                </tr>
              )
            })}
          </table>
        </div>
        <div>
          <Pagination totalPages={totalPages} page={pageNo} onPageChange={handlePageChange}>
          </Pagination>
        </div>
      </div>
    );
    //}
  }
  else {
    return (
      <div className='App'>
        <div className="App1">
          <table>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
            </tr>
            {transaction.childTransactions.map((child) => {
              return (
                <tr key={child.id}>
                  <td>{child.id}</td>
                  <td>{transaction.sender}</td>
                  <td>{transaction.receiver}</td>
                  <td>{transaction.totalAmount}</td>
                  <td>{child.paidAmount}</td>
                </tr>
              )
            })}
          </table>
        </div>
        <div>
          <button onClick={() => setMain()}>Back</button>
        </div>
      </div>
    );
  }
}
export default App;
import SidebarWithHeader from "../components/SideBarWithHeader";
import Router from "next/router";
import { Box, Flex, Spacer } from "@chakra-ui/layout";
import { Table, Tbody, Td, Tr } from "@chakra-ui/table";
import { Select, Text } from "@chakra-ui/react";
import useSWR from "swr";

import React, { useEffect } from "react";
import {
  CashAsset,
  LongtermAssets,
  LongTermLiabilities,
  ShortTermLiabilities,
} from "../data/assets";
import EditableTable from "../components/EditableTable";

let currentSelectedCurrency = "USD";
const reducer = (preVal, curVal) => preVal + curVal;
const Calculator = () => {
  const CashAssetsColumns = React.useMemo(
    () => [
      {
        Header: "Cash and Investment",
        accessor: "category",
      },
      {
        Header: "",
        accessor: "cost",
      },
    ],
    []
  );
  const [assetData, setAssetData] = React.useState(() => {
    return CashAsset;
  });
  const [originalAssetData] = React.useState(assetData);

  const LongTermAssetsColumns = React.useMemo(
    () => [
      {
        Header: "Long Term Assets",
        accessor: "category",
      },
      {
        Header: "",
        accessor: "cost",
      },
    ],
    []
  );
  const [longTermAssetData, setLongTermAssetData] = React.useState(() => {
    return LongtermAssets;
  });
  const [originalLongTermAssetData] = React.useState(longTermAssetData);
  const [totalAssets, setTotalAssets] = React.useState(() => {
    const assetData = CashAsset.map((item) => item.cost);
    const longtermAssetData = LongtermAssets.map((item) => item.cost);
    return assetData.reduce(reducer) + longtermAssetData.reduce(reducer);
  });
  const ShortTermLiabilitiesColumns = React.useMemo(
    () => [
      {
        Header: "Short Term Liabilities",
        accessor: "category",
      },
      {
        Header: "Monthly Payment",
        accessor: "monthly",
      },
      {
        Header: "",
        accessor: "cost",
      },
    ],
    []
  );
  const [shortTermLiabilitiesData, setShortTermLiabilitiesData] =
    React.useState(() => {
      return ShortTermLiabilities;
    });
  const [originalShortTermLiabilitiesData] = React.useState(
    shortTermLiabilitiesData
  );
  const LongTermLiabilitiesColumns = React.useMemo(
    () => [
      {
        Header: "Long Term Debt",
        accessor: "category",
      },
      {
        Header: "",
        accessor: "monthly",
      },
      {
        Header: "",
        accessor: "cost",
      },
    ],
    []
  );
  const [longerTermLiabilitiesData, setLongTermLiabilitiesData] =
    React.useState(() => {
      return LongTermLiabilities;
    });
  const [originalLongTermLiabilitiesData] = React.useState(
    longerTermLiabilitiesData
  );
  const [totalLiabilities, setTotalLiabilities] = React.useState(() => {
    const shortTermDebtData = ShortTermLiabilities.map((item) => item.cost);
    const longtermDebtData = LongTermLiabilities.map((item) => item.cost);
    return shortTermDebtData.reduce(reducer) + longtermDebtData.reduce(reducer);
  });

  const [totalNetWorth, setTotalNetWorth] = React.useState(() => {
    return totalAssets - totalLiabilities;
  });

  const [currencySymbol, setCurrencySymbol] = React.useState("$");
  useEffect(() => {
    getUpdatedData();
  }, assetData);


  const updateData = async (rowIndex, columnId, value, setData) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: parseFloat(value),
          };
        }
        return row;
      })
    );
  };

  const getUpdatedData = async (currencyUpdate: boolean = false) => {
    try {
      console.log("selected currency ", currentSelectedCurrency);
      // calling
      const result = await fetch(`http://localhost:3001/networth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedCurrency: currentSelectedCurrency,
          cashAssets: assetData,
          longTermAssets: longTermAssetData,
          shortTermLiabilities: shortTermLiabilitiesData,
          longTermDebt: longerTermLiabilitiesData,
        }),
      });
      const data = await result.json();
      // if the currency change, we update
      if (currencyUpdate) {
      setAssetData(data.cashAssets);
      setLongTermAssetData(data.longTermAssets);
      setShortTermLiabilitiesData(data.shortTermLiabilities);
      setLongTermLiabilitiesData(data.longTermDebt);
      }
      setTotalAssets(data.totalAssets);
      setTotalLiabilities(data.totalLiabilities);
      setTotalNetWorth(data.totalNetworth);
      setCurrencySymbol(data.currentCurrencySymbol);
    } catch (error) {
      console.log(error);
    }
  };

  const onCurrencyChange = async (selectedCurrency) => {
    console.log("currency event", selectedCurrency);
    currentSelectedCurrency = selectedCurrency;
    await getUpdatedData(true);
  };

  return (
    <SidebarWithHeader>
      <Text>Track Your Networth</Text>
      <Table variant="simple" colorScheme={"white"} bg={"white"}>
        <Tbody>
          <Tr>
            <Td></Td>
            <Td textAlign={"center"}>
              <Flex>
                <Box />
                <Spacer />
                <Box w="150px">
                  <Text>Selected Currency:</Text>
                </Box>
                <Box>
                  <Select
                    variant="unstyled"
                    textColor={"red"}
                    onChange={(e) => onCurrencyChange(e.target.value)}
                    defaultValue={"USD"}
                  >
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="CHF">CHF</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="HKD">HKD</option>
                    <option value="JPY">JPY</option>
                    <option value="NZD">NZD</option>
                    <option value="SGD">SGD</option>
                  </Select>
                </Box>
              </Flex>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Text textColor={"green.500"}>Net Worth</Text>
            </Td>
            <Td isNumeric>
              <Text textColor={"green.500"}>
                {currencySymbol}
                {totalNetWorth}
              </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Box height={"20px"}></Box>
      <Text textColor={"green.500"}>Assests</Text>
      <EditableTable
        columns={CashAssetsColumns}
        data={assetData}
        updateData={updateData}
        setData={setAssetData}
        currencySymbol={currencySymbol}
      />
      <EditableTable
        columns={LongTermAssetsColumns}
        data={longTermAssetData}
        updateData={updateData}
        setData={setLongTermAssetData}
        currencySymbol={currencySymbol}
      />
      <Table variant="simple" colorScheme={"white"} bg={"white"}>
        <Tbody>
          <Tr>
            <Td>
              <Text textColor={"green.500"}>Total Assets</Text>
            </Td>
            <Td border={"1px"} width={"250px"} isNumeric>
              <Text textAlign={"left"} textColor={"green.500"}>
                {currencySymbol}
                {totalAssets}
              </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Box height={"20px"}></Box>
      <Text textColor={"green.500"}>Liabilities</Text>
      <EditableTable
        columns={ShortTermLiabilitiesColumns}
        data={shortTermLiabilitiesData}
        updateData={updateData}
        setData={setShortTermLiabilitiesData}
        currencySymbol={currencySymbol}
      />
      <EditableTable
        columns={LongTermLiabilitiesColumns}
        data={longerTermLiabilitiesData}
        updateData={updateData}
        setData={setLongTermLiabilitiesData}
        currencySymbol={currencySymbol}
      />
      <Table variant="simple" colorScheme={"white"} bg={"white"}>
        <Tbody>
          <Tr>
            <Td>
              <Text textColor={"green.500"}>Total Liabilities</Text>
            </Td>
            <Td border={"1px"} width={"250px"} isNumeric>
              <Text textAlign={"left"} textColor={"green.500"}>
                {currencySymbol}
                {totalLiabilities}
              </Text>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </SidebarWithHeader>
  );
};

export default Calculator;

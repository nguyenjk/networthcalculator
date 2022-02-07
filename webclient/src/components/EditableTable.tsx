import { useTable } from "react-Table";
import React from "react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/Table";
import { Box, Flex } from "@chakra-ui/react";

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData,
  setData
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    if (!Number(e.target.value)) {
      return;
    }
    setValue(e.target.value);
    
  };

  const onKeyUp = (e) => {
    // if (e.key === 'Enter' || e.keyCode === 13) {
    //   updateData(index, id, value, setData);
    // }

    updateData(index, id, value, setData);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onKeyUp={onKeyUp} />;
};

// Set our ediTable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
export default function EditableTable({ columns, data, updateData, setData, currencySymbol }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      defaultColumn,
      updateData,
      setData
    });

  // Render the UI for your Table
  return (
    <>
      <Table
        variant="simple"
        colorScheme={"white"}
        bg={"white"}
        {...getTableProps()}
      >
        <Thead border={"1px"} borderLeft={"InactiveBorder"} textAlign={"left"}>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.id === "cost") {
                    return (
                      <Td
                        border={"1px"}
                        width={"250px"}
                        {...cell.getCellProps()}
                      >
                        <Flex textColor={"red.500"}>
                          <Box textAlign={"left"}>{currencySymbol}</Box>
                          <Box textAlign={"right"}>{cell.render("Cell")}</Box>
                        </Flex>
                      </Td>
                    );
                  } else if (cell.column.id === "monthly") {
                    return (
                      <Td width={"250px"} {...cell.getCellProps()}>
                        <Flex>
                          <Box width={"50px"}>{currencySymbol}</Box>
                          <Box flex={1} textAlign={"center"}>
                            {cell.row.values[cell.column.id]}
                          </Box>
                        </Flex>
                      </Td>
                    );
                  } else {
                    return (
                      <Td {...cell.getCellProps()}>
                        {cell.row.values[cell.column.id]}
                      </Td>
                    );
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}

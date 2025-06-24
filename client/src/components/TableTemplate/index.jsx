import { Table, TableContainer, TableHead, TableRow, TableCell, tableCellClasses, TableBody, TablePagination } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useContext, useState } from "react";
import { ThemeContext } from "styled-components";
import { TablePaginationActions } from './TablePaginationActions';

const columns = [
    { id: 'name', label: 'Name' },
    { id: 'surname', label: 'Surname'},
    { id: 'email', label: 'Email'},
    { id: 'admin', label: 'Admin'}
];

export const TableTemplate = ({ data }) => {
    const theme = useContext(ThemeContext);

    const [page, setPage] = useState(0);
    const rowsPerPage = 50;

    const rows = data.map((s) => ({
        name: s.name,
        surname: s.surname,
        email: s.email,
        admin: s.admin.toString()
    }));

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const StyledTableCell = styled(TableCell)(() => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.colors.black,
          color: theme.colors.white,
          
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
          color: theme.colors.white,
          border: 0,
        },
    }));

    const StyledTableRow = styled(TableRow)(() => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.colors.white10,
      },
    }));

    return (
      <TableContainer sx={{ maxHeight: '100%', height: '100%', userSelect: 'none' }}>
          <Table sx={{ maxHeight: '100%' }} stickyHeader={true}>
              <TableHead>
                  <StyledTableRow>
                    {columns.map((column) => (
                      <StyledTableCell key={column.id}>
                          {column.label}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
              </TableHead>

              <TableBody>
                  {(rowsPerPage > 0
                      ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : rows
                      ).map((row, index) => (
                          <StyledTableRow key={index}>
                              {columns.map((column) => (
                                  <StyledTableCell key={`${index}-${column.id}`}>
                                      {row[column.id]}
                                  </StyledTableCell>
                              ))}
                          </StyledTableRow>
                      )
                  )}
                  {emptyRows > 0 && (
                    <StyledTableRow style={{ height: 53 * emptyRows }}>
                      <StyledTableCell colSpan={columns.length} />
                    </StyledTableRow>
                  )}
              </TableBody>
          </Table>
          <TablePagination
            colSpan={3}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            sx= {{color: theme.colors.white}}
            onPageChange={handleChangePage}
            ActionsComponent={TablePaginationActions}
            rowsPerPageOptions={[]}
          />
      </TableContainer>
    )
}
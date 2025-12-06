import { useState } from "react";
import { Project } from "../../types/project";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  IconButton,
} from "@mui/material";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import DefaultSortIcon from "../icon/DefaultSort";
import AscIcon from "../icon/AscIcon";
import DescIcon from "../icon/DescIcon";
import EditProjectIcon from "../icon/Edit";
import DeleteProjectIcon from "../icon/Delete";

type SortOrder = "none" | "asc" | "desc";

interface ProjectTableProps {
  data: Project[];
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>

      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>

      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>

      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export function ProjectTable({ data = [] }: ProjectTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --------------------- SORT ---------------------------------------------
  const [sortBy, setSortBy] = useState<"name" | "updated_at" | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  const cycleSort = (column: "name" | "updated_at") => {
    if (sortBy !== column) {
      setSortBy(column);
      setSortOrder("asc");
      return;
    }

    setSortOrder((prev) =>
      prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"
    );
  };

  const sortedData = [...data];

  if (sortOrder !== "none" && sortBy) {
    sortedData.sort((a, b) => {
      const valueA =
        sortBy === "updated_at" ? new Date(a.updated_at).getTime() : a[sortBy];

      const valueB =
        sortBy === "updated_at" ? new Date(b.updated_at).getTime() : b[sortBy];

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  const sortIndicator = (column: "name" | "updated_at") => {
    if (sortBy !== column) return <DefaultSortIcon />;
    if (sortOrder === "asc") return <AscIcon />;
    if (sortOrder === "desc") return <DescIcon />;
    return <DefaultSortIcon />;
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-[#0F1518]">
            <TableRow>
              <TableCell
                sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => cycleSort("name")}
              >
                <div className="flex items-center pl-2">
                  <div className="text-[#E6F0E6]">Project Name</div>
                  <div className="pl-2">{sortIndicator("name")}</div>
                </div>
              </TableCell>

              <TableCell
                align="left"
                onClick={() => cycleSort("updated_at")}
                sx={{ cursor: "pointer", width: "1%", whiteSpace: "nowrap" }}
              >
                <div className="flex items-center">
                  <div className="text-[#E6F0E6]">Last Updated</div>
                  <div className="pl-2">{sortIndicator("updated_at")}</div>
                </div>
              </TableCell>

              <TableCell align="right" sx={{ width: "1%" }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((project) => (
              <TableRow key={project.name}>
                <TableCell>
                  <div className="pl-2">{project.name}</div>
                </TableCell>

                <TableCell align="left">
                  {new Date(project.updated_at).toLocaleDateString("th-TH")}
                </TableCell>

                <TableCell align="right">
                  <div className="flex justify-around pr-2">
                    <div className="pl-6">
                      <EditProjectIcon />
                    </div>
                    <div className="pl-6">
                      <DeleteProjectIcon />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}

import DataTable from "react-data-table-component";
import { useState } from "react";

const DatatableComponent = ({ columns, data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter data based on search term
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  const subHeaderComponent = (
    <div className="d-flex align-items-center">
      Search:
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          padding: "4px",
          width: "100%",
          maxWidth: "300px",
          marginLeft: "8px",
        }}
      />
    </div>
  );

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      subHeader
      subHeaderComponent={subHeaderComponent}
      subHeaderWrap
      pagination
      striped
      customStyles={customStyles}
    />
  );
};

const customStyles = {
  headCells: {
    style: {
      paddingTop: "8px",
      paddingBottom: "8px",
      backgroundColor: "#20a8d8",
      color: "white",
      fontWeight: "bold",
      borderBottom: "1px solid black",
      textAlign: "left",
    },
  },
  cells: {
    style: {
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
};

export default DatatableComponent;

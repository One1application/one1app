export const formatTableData = (data, { fields }) => {
    return data.map((item) =>
      fields.map((field) => item[field] || null)
    );
  };
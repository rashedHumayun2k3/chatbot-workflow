const FromValidate = (values) => {
  const errors = {};
  const requiredFields = [
    'title',
  ];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  return errors;
};

export default FromValidate;

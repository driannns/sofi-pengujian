const Button = ({ value, variant, action }) => {
  return (
    <button
      className={`btn w-50 fw-bold ${variant}`}
      onClick={() => {
        action;
      }}
    >
      {value}
    </button>
  );
};

export default Button;

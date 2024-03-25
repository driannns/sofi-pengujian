import ReactLoading from "react-loading";

const Loading = () => {
  return (
    <div style={bgLoading}>
      <ReactLoading type="spin" color="#fff" height={50} width={50} />
    </div>
  );
};

const bgLoading = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default Loading;

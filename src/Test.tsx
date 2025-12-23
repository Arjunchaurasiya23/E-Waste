import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const [x] = useState(0);
  const navigate = useNavigate();
  return <div onClick={() => navigate("/")}>{x}</div>;
}

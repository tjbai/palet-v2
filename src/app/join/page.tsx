"use client";

import Join from "@/components/Join";
import axios from "axios";
import { useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    const res = await axios.post("http://localhost:3000/api/auth/register", {
      username,
      password,
    });
    console.log(res);
  }

  return <Join />;
}

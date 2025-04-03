import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000*100, //1000 * 10, // 10 seconds
      refetchOnWindowFocus: false,
    },
  },
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter> 
        {
          <App />
        }
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
  </QueryClientProvider>
);


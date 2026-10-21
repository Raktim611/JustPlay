import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/Config/redux/store";
import { ToastContainer } from "react-toastify";
import { Slide, Bounce, Zoom, Flip } from "react-toastify";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <link rel="icon" href="/logo.png" />
        
      </Head>
      <Component {...pageProps} />
      <ToastContainer
      className="Container"
      position="bottom-center" 
      autoClose={1000}
      transition={Flip}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      />
    </Provider>
  
);
}

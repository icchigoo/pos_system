import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { AuthProvider } from "src/contexts/AuthContext";
import { GroupProvider } from "src/contexts/group-context";
import { CategoryProvider } from "src/contexts/category-context";
import { CompanyProvider } from "src/contexts/company-context";
import { ProductProvider } from "src/contexts/product-context";
import { UnitProvider } from "src/contexts/unit-context";
import { TaxProvider } from "src/contexts/tax-context";
import { SalesProvider } from "src/contexts/sales-context";

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Devias Kit</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <GroupProvider>
            <CategoryProvider>
              <CategoryProvider>
                <CompanyProvider>
                  <ProductProvider>
                    <UnitProvider>
                      <TaxProvider>
                        <SalesProvider>
                          <ThemeProvider theme={theme}>
                            <CssBaseline />
                            {getLayout(<Component {...pageProps} />)}
                          </ThemeProvider>
                        </SalesProvider>
                      </TaxProvider>
                    </UnitProvider>
                  </ProductProvider>
                </CompanyProvider>
              </CategoryProvider>
            </CategoryProvider>
          </GroupProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;

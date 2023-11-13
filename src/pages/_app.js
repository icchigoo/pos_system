import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "simplebar-react/dist/simplebar.min.css";
import { GroupProvider } from "src/contexts/group-context";
import { CategoryProvider } from "src/contexts/category-context";
import { OpeningStockProvider } from "src/contexts/opening-stock";
import { UnitProvider } from "src/contexts/unit-context";
import { ProductProvider } from "src/contexts/product-context";
import { TaxProvider } from "src/contexts/tax-context";
import { MembershipProvider } from "src/contexts/membership";
import { CompanyProvider } from "src/contexts/company-context";
import { StockAdjustmentProvider } from "src/contexts/stock-adjustment";
import { SupplierProvider } from "src/contexts/supplier-context";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>SBRC</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <GroupProvider>
            <CategoryProvider>
              <OpeningStockProvider>
                <UnitProvider>
                  <ProductProvider>
                    <TaxProvider>
                      <MembershipProvider>
                        <CompanyProvider>
                          <StockAdjustmentProvider>
                            <SupplierProvider>
                              <ThemeProvider theme={theme}>
                                <CssBaseline />
                                <AuthConsumer>
                                  {(auth) =>
                                    auth.isLoading ? (
                                      <SplashScreen />
                                    ) : (
                                      getLayout(<Component {...pageProps} />)
                                    )
                                  }
                                </AuthConsumer>
                              </ThemeProvider>
                            </SupplierProvider>
                          </StockAdjustmentProvider>
                        </CompanyProvider>
                      </MembershipProvider>
                    </TaxProvider>
                  </ProductProvider>
                </UnitProvider>
              </OpeningStockProvider>
            </CategoryProvider>
          </GroupProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;

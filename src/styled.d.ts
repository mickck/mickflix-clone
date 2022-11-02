import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      netflixDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
  }
}

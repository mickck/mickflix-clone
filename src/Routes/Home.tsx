import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.netflixDark};
`;
// while is loading the data.
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  // show full images of a screen
  // a stroy and a title of the first movie
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;

  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(${(props) => props.bgPhoto});
  //top is transparent to little bit a dark
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  // a stroy of the first movie
  font-size: 30px;
  width: 50%;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 45%);
`;
function Home() {
  //const { data, isLoading, error } = useQuery(queryKey, queryFn?, queryOption);
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies, nowPlaying"], getMovies);

  // console.log(data, isLoading);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>is Loading</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;

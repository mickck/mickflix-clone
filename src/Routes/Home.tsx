import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useMatch, useNavigate } from "react-router-dom";

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
const Banner = styled.div<{ bgphoto: string }>`
  // show full images of a screen
  // a stroy and a title of the first movie
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;

  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(${(props) => props.bgphoto});
  //top is transparent to little bit a dark
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 65px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  // a stroy of the first movie
  font-size: 28px;
  width: 50%;
  text-shadow: 2px 2px 4px rgb(0 0 0 / 45%);
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  //220x122
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  height: 166px;
  font-size: 65px;
  cursor: pointer;
  /*It makes not to crop images  */
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MoreInfoBox = styled(motion.div)`
  position: absolute;
  width: 720px;
  height: 80vh;
  border-radius: 10px;
  overflow: hidden;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.8);
`;

const InfoCover = styled.div`
  width: 100%;
  height: 337.2px;
  background-size: cover;
  background-position: center center;
`;
const InfoTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: left;
  padding: 20px;
  font-size: 35px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -75px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
`;
//variants to check increasing index
const rowVariants = {
  hidden: {
    x: window.outerWidth - 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 10,
  },
};

const BoxVariants = {
  normar: {
    scale: 1,
  },
  hover: {
    scale: 1.4,
    y: -40,
    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.2,
    },
  },
};

const InfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.7,
      type: "tween",
      duration: 0.2,
    },
  },
};

const offset = 6;

function Home() {
  //const { data, isLoading, error } = useQuery(queryKey, queryFn?, queryOption);
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies, nowPlaying"], getMovies);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigator = useNavigate();
  const moreInfoMatch = useMatch("/movies/:movieId");
  // console.log(moreInfoMatch?.params.movieId);
  const { scrollY } = useScroll();

  /* function increse the index
  check before icreasing an index */
  const increaseIndex = () => {
    if (data) {
      //check  Row is leaving
      if (leaving) return;
      toggleLeaving();
      //it's possible data is not exit
      const totalMovies = data.results.length - 1;
      //to make int of maxIndex'value
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  // if onExitComplete works, set leaving false.
  const toggleLeaving = () => setLeaving((prev) => !prev);

  /* get movie.id and send under the url using useNavigate() */
  const onBoxClicked = (movieId: number) => {
    navigator(`/movies/${movieId}`);
  };

  /*check exiting moreInfoMatch  */
  const clickedMovie = moreInfoMatch?.params.movieId && data?.results.find((movie) => movie.id + "" === moreInfoMatch.params.movieId);
  // console.log(clickedMovie);
  const onOverlayClicked = () => navigator("/");
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>is Loading</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")} onClick={increaseIndex}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
              <Row key={index} variants={rowVariants} initial={rowVariants.hidden} animate={rowVariants.visible} exit={rowVariants.exit} transition={{ type: "tween", duration: 1.5 }}>
                {/* movie[0] alreay used  */}
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover='hover'
                      initial='normal'
                      bgphoto={makeImagePath(movie.backdrop_path, "w400")}
                      transition={{ type: "tween", duration: 0.2 }}
                      onClick={() => onBoxClicked(movie.id)}
                      layoutId={movie.id + ""}>
                      <Info variants={InfoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {moreInfoMatch ? (
              <>
                <OverLay onClick={onOverlayClicked} style={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <MoreInfoBox style={{ top: scrollY.get() + 50 }} layoutId={moreInfoMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <InfoCover style={{ backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})` }} />
                      <InfoTitle>{clickedMovie.title}</InfoTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </MoreInfoBox>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;

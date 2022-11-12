import { motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch, ISearchResult } from "../api";
import { makeImagePath } from "../utils";

const Result = styled.div`
  top: 200px;
  position: relative;
  margin-bottom: 20px;
`;

const GridWrapper = styled.div`
  position: relative;
  top: 250px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
  width: 300px;
  background-image: url(${(props) => props.bgphoto});

  background-color: aquamarine;
  background-size: cover;
  background-position: center center;
`;

const BoxTitle = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  font-size: calc(12px+0.5vw);
  font-weight: 600;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  display: flex;
  position: relative;
  bottom: -150px;
`;
const Category = styled.div`
  position: relative;
  top: 250px;
  color: white;
  padding: 15px;
  font-size: 30px;
  font-weight: 700;
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
  /* background-color: rgba(0, 0, 0, 0.9); */
`;
const InfoCover = styled.div`
  width: 100%;
  height: 337.2px;
  background-size: cover;
  background-position: center center;
  z-index: 100;
`;
const InfoTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: left;
  padding: 20px;
  font-size: 35px;
  position: relative;
  top: -80px;
  z-index: 100;
`;
const InfoOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
  z-index: 99;
`;

const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
`;

function Search() {
  const location = useLocation();

  const url = new URLSearchParams(location.search).get("keyword");
  const keyword = url?.substring(0, url?.indexOf("/"));

  const { data, isLoading } = useQuery<ISearchResult>(["search: " + keyword, 1], () =>
    getSearch({
      keyword: keyword,
    })
  );

  const navigator = useNavigate();

  const { scrollY } = useScroll();

  const searchId = url?.substring(url?.indexOf("/") + 1, url.length);

  const clickedMoive = searchId && data?.results.filter((data) => data.media_type === "movie").find((prev) => prev.id + "" === searchId);

  const clickedTv = searchId && data?.results.filter((data) => data.media_type === "tv").find((prev) => prev.id + "" === searchId);

  const onOverlayClicked = () => navigator(-1);
  return (
    <>
      <Result style={{ fontSize: "25px" }}>Result by {keyword}</Result>
      {isLoading ? (
        <div>isLoading...</div>
      ) : (
        <>
          <Category>Movie</Category>
          <GridWrapper>
            {data?.results
              .filter((data) => data.media_type === "movie")
              .map((prev) => (
                <Box
                  key={prev.id}
                  onClick={() => {
                    navigator(`/search?keyword=${keyword}/${prev.id}`);
                  }}
                  style={{ backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(prev.backdrop_path, "w300")})` }}
                  bgphoto={makeImagePath(prev.backdrop_path, "w400")}
                  layoutId={prev.id + "movie"}>
                  <BoxTitle>{prev.title}</BoxTitle>
                </Box>
              ))}
          </GridWrapper>
          {searchId ? (
            <>
              <OverLay onClick={onOverlayClicked} style={{ opacity: 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
              <MoreInfoBox style={{ top: scrollY.get() + 50 }} layoutId={searchId + "movie"}>
                {clickedMoive && (
                  <>
                    <InfoCover style={{ backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(clickedMoive.backdrop_path, "w500")})` }} />
                    <InfoTitle>{clickedMoive.title}</InfoTitle>
                    <InfoOverview>{clickedMoive.overview}</InfoOverview>
                  </>
                )}
              </MoreInfoBox>
            </>
          ) : null}
          <Category>TV show</Category>
          <GridWrapper>
            {data?.results
              .filter((data) => data.media_type === "tv")
              .map((prev) => (
                <Box
                  key={prev.id}
                  onClick={() => {
                    navigator(`/search?keyword=${keyword}/${prev.id}`);
                  }}
                  style={{ backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(prev.backdrop_path, "w300")})` }}
                  bgphoto={makeImagePath(prev.backdrop_path, "w400")}
                  layoutId={prev.id + "tv"}>
                  <BoxTitle style={{ justifyContent: "center" }}>{prev.name}</BoxTitle>
                </Box>
              ))}
          </GridWrapper>
          {searchId ? (
            <>
              <OverLay onClick={onOverlayClicked} style={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <MoreInfoBox style={{ top: scrollY.get() + 50 }} layoutId={searchId + "tv"}>
                {clickedTv && (
                  <>
                    <InfoCover style={{ backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(clickedTv.backdrop_path, "w500")})` }} />
                    <InfoTitle>{clickedTv.name}</InfoTitle>
                    <InfoOverview>{clickedTv.overview}</InfoOverview>
                  </>
                )}
              </MoreInfoBox>
            </>
          ) : null}
        </>
      )}
    </>
  );
}

export default Search;

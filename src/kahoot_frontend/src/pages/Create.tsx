import { useState, useRef, useEffect, useCallback } from "react";
import {
  generateRandomString,
  checkQuizData,
  getCurrentFormattedDateTime,
  uploadImageToIPFS,
} from "../helper/helper";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import {
  _SERVICE,
  Question,
} from "../../../declarations/kahoot_backend/kahoot_backend.did";
import IC from "../utils/IC";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { LoadingLayover } from "../components/LoadingLayover";
import {
  BottomQuizDataMobile,
  DeleteModalComponent,
  ExitKahootModalComponent,
  MiddleComponentMobile,
  MiddleComponentNonMobile,
  NavbarMobile,
  NavbarNonMobile,
  QuestionModalComponent,
  RightSidebar,
  SidebarNonMobile,
  TimeLimitModalComponent,
  TitleModalComponent,
  UploadImageModalComponent,
  ValidateModalComponent,
} from "../components/CreatePage";
import { BouncyModal, JiggleModal } from "../components";

function Create() {
  const fileInputRef = useRef(null);
  const location = useLocation();
  const { state } = location;
  const principal = state?.routerPrincipal;
  const navigate = useNavigate();
  const defaultQuizData = {
    question: "",
    text1: "",
    text2: "",
    text3: "",
    text4: "",
    answer1Clicked: false,
    answer2Clicked: false,
    answer3Clicked: false,
    answer4Clicked: false,
    additionalAnswers: 0,
    trueOrFalseAnswer: "",
    timeLimit: 20,
    answerOptions: "single",
    imageUrl: "cdn.svg",
  };
  const timeLimitData = [5, 10, 20, 30, 45, 60, 90, 120, 180, 240];
  const isMobileOrTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const [currentId, setCurrentId] = useState(1);
  const [isOpenModalJiggle, setIsOpenModalJiggle] = useState(false);
  const [isOpenExitKahootModal, setIsOpenExitKahootModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openModalQuestion, setOpenModalQuestion] = useState(false);
  const [mouseEnter1, setMouseEnter1] = useState(false);
  const [mouseEnter2, setMouseEnter2] = useState(false);
  const [mouseEnter3, setMouseEnter3] = useState(false);
  const [mouseEnter4, setMouseEnter4] = useState(false);
  const [isChangingQuestionType, setIsChangingQuestionType] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mouseEnterUl, setMouseEnterUl] = useState(false);
  const [clickedQuizIndex, setClickedQuizIndex] = useState(0);
  const [hoveredQuizIndex, setHoveredQuizIndex] = useState(-1);
  const [isOpenModalTitle, setIsOpenModalTitle] = useState(false);
  const [previousKahootTitle, setPreviousKahootTitle] = useState(
    state?.mode === "create" ? "" : state?.title
  );
  const [kahootTitle, setKahootTitle] = useState(
    state?.mode === "create" ? "" : state?.title
  );
  const [kahootTitleTemp, setKahootTitleTemp] = useState(
    state?.mode === "create" ? "" : state?.title
  );
  const [previousKahootDescription, setPreviousKahootDescription] = useState(
    state?.mode === "create" ? "" : state?.description
  );
  const [, setKahootDescription] = useState(
    state?.mode === "create" ? "" : state?.description
  );
  const [kahootDescriptionTemp, setKahootDescriptionTemp] = useState(
    state?.mode === "create" ? "" : state?.description
  );
  const [, setImageCoverUrl] = useState(
    state?.mode === "create" ? "" : state?.imageCoverUrl
  );
  const [imageCoverUrlTemp, setImageCoverUrlTemp] = useState(
    state?.mode === "create" ? "" : state?.imageCoverUrl
  );
  const [previousImageCoverUrl, setPreviousImageCoverUrl] = useState(
    state?.mode === "create" ? "" : state?.imageCoverUrl
  );
  const [backend, setBackend] = useState<_SERVICE>();
  const [isOpenModalValidate, setIsOpenModalValidate] = useState(false);
  const [quizChecked, setQuizChecked] =
    useState<{ index: number; messages: string[] }[]>();
  const [isOpenModalTimeLimit, setIsOpenModalTimeLimit] = useState(false);
  const [fromSaving, setFromSaving] = useState(false);
  const [quizData, setQuizData] = useState<Question[]>(
    state?.mode === "create"
      ? [
          {
            id: currentId,
            questionType: "Quiz",
            ...defaultQuizData,
          },
        ]
      : state?.data
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flexibleClickedQuizIndex, setFlexibleClickedQuizIndex] = useState(-1);
  const [loadingFile, setLoadingFile] = useState(false);
  const [currentTimeLimit, setCurrentTimeLimit] = useState(
    quizData?.[clickedQuizIndex]?.timeLimit ?? 20
  );
  const [loadingCoverImage, setLoadingCoverImage] = useState(false);
  const [draggingCoverImage, setDraggingCoverImage] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    try {
      if (file && file.type.startsWith("image/")) {
        setDragging(false);
        setLoadingFile(true);
        const imageIPFSURL = await uploadImageToIPFS(file);
        setIsOpen(false);
        const reader = new FileReader();
        reader.onload = (e) => {
          let quizTemp = [...quizData];
          quizTemp[clickedQuizIndex].imageUrl = imageIPFSURL ?? "";
          setQuizData([...quizTemp]);
        };
        reader.readAsDataURL(file);
        setLoadingFile(false);
      } else {
        Swal.fire("Error!", "Can only upload images!", "error");
      }
    } catch (e) {
      setLoadingFile(false);
    }
  };

  const handleCoverImage = async (event: any) => {
    const file = event.target.files[0];
    try {
      if (file && file.type.startsWith("image/")) {
        setLoadingCoverImage(true);
        const imageIPFSURL = await uploadImageToIPFS(file);
        setDraggingCoverImage(false);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageCoverUrlTemp(imageIPFSURL ?? "");
        };
        reader.readAsDataURL(file);
        setLoadingCoverImage(false);
      } else {
        Swal.fire("Error!", "Can only upload images!", "error");
      }
    } catch (e) {
      setLoadingCoverImage(false);
    }
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    setDragging(false);
    setIsOpen(false);

    const file = e.dataTransfer.files[0];
    try {
      if (file && file.type.startsWith("image/")) {
        setLoadingFile(true);
        const imageIPFSURL = await uploadImageToIPFS(file);
        const reader = new FileReader();
        reader.onload = () => {
          let quizTemp = [...quizData];
          quizTemp[clickedQuizIndex].imageUrl = imageIPFSURL ?? "";
          setQuizData([...quizTemp]);
        };
        reader.readAsDataURL(file);
        setLoadingFile(false);
      } else {
        setLoadingFile(false);
        Swal.fire("Error!", "Can only upload images!", "error");
      }
    } catch (e) {}
  };

  const toggleModalSecond = () => {
    setIsOpen(!isOpen);
  };

  const toggleModalJiggle = () => {
    setIsOpenModalJiggle(!isOpenModalJiggle);
  };

  const toggleModalQuestion = () => {
    setOpenModalQuestion((prevState) => !prevState);
  };

  const toggleModalTitle = () => {
    setIsOpenModalTitle((prevState) => !prevState);
  };

  const toggleModalExitKahoot = () => {
    setIsOpenExitKahootModal((prevState) => !prevState);
  };

  const toggleModalValidate = () => {
    setIsOpenModalValidate((prevState) => !prevState);
  };

  const toggleModalTimeLimit = () => {
    setIsOpenModalTimeLimit((prevState) => !prevState);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      setTimeout(() => {
        if (bottomRef.current) {
          bottomRef.current.scrollTop = bottomRef?.current?.scrollHeight;
        }
      }, 0);
    }
  };

  const scrollToEnd = () => {
    const element = bottomRef.current;
    if (element) {
      setTimeout(() => {
        element.scrollLeft = element?.scrollWidth - element?.clientWidth;
      }, 0);
    }
  };

  const newQuizData = {
    id: currentId + 1,
    ...defaultQuizData,
  };

  const handleAddQuestion = useCallback(() => {
    if (loading) return;
    setOpenModalQuestion(true);
  }, []);

  const handleCopyQuiz = useCallback(
    (index: number) => {
      let quizTemp = [...quizData];
      quizTemp.splice(index + 1, 0, {
        ...quizData?.[index],
        id: currentId + 1,
      });
      setCurrentId((prevState) => prevState + 1);
      setQuizData([...quizTemp]);
    },
    [quizData, currentId]
  );

  const handleDeleteQuiz = useCallback(
    (index: number) => {
      if (quizData?.length === 1) return;
      setFlexibleClickedQuizIndex(index);
      toggleModalJiggle();
    },
    [quizData, flexibleClickedQuizIndex, isOpenModalJiggle]
  );

  const addOrUpdateGame = useCallback(() => {
    if (state?.mode === "create") {
      const gamePin = generateRandomString();
      backend
        ?.addGame(
          gamePin,
          principal,
          kahootTitleTemp,
          kahootDescriptionTemp,
          quizData,
          getCurrentFormattedDateTime(),
          imageCoverUrlTemp
        )
        ?.then((result) => {
          setLoading(false);
          Swal.fire({
            title: "Success!",
            text: "You have successfully saved your quiz!",
            icon: "success",
          })
            .then((res) => {
              navigate("/profile", {
                state: {
                  routerPrincipal: state.routerPrincipal,
                },
              });
            })
            .catch((thisErr) => {
              console.log(thisErr);
            });
        })
        ?.catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } else {
      backend
        ?.updateGame(
          state?.gamePin,
          kahootTitleTemp,
          kahootDescriptionTemp,
          quizData,
          imageCoverUrlTemp
        )
        ?.then((result) => {
          setLoading(false);
          Swal.fire({
            title: "Success!",
            text: "You have successfully updated your quiz!",
            icon: "success",
          })
            .then((res) => {
              navigate("/profile", {
                state: {
                  routerPrincipal: state.routerPrincipal,
                },
              });
            })
            .catch((thisErr) => {
              console.log(thisErr);
            });
        })
        .catch((e) => {
          console.log(e, "< Error");
        });
    }
  }, [
    principal,
    kahootTitleTemp,
    kahootDescriptionTemp,
    quizData,
    principal,
    imageCoverUrlTemp,
    state?.gamePin,
  ]);

  const handleSaveQuiz = useCallback(async () => {
    const checkingQuiz = checkQuizData(quizData);
    if (checkingQuiz?.length > 0) {
      setQuizChecked(checkingQuiz);
      toggleModalValidate();
    } else if (!kahootTitle) {
      setFromSaving(true);
      toggleModalTitle();
    } else {
      setLoading(true);
      addOrUpdateGame();
    }
  }, [
    quizChecked,
    fromSaving,
    loading,
    quizData,
    kahootTitle,
    isOpenModalValidate,
    imageCoverUrlTemp,
    kahootTitleTemp,
    kahootDescriptionTemp,
  ]);

  const handleEditQuizTitle = useCallback(() => {
    toggleModalTitle();
    setPreviousKahootTitle(kahootTitleTemp);
    setPreviousKahootDescription(kahootDescriptionTemp);
    setPreviousImageCoverUrl(imageCoverUrlTemp);
  }, [
    isOpenModalTitle,
    kahootTitleTemp,
    kahootDescriptionTemp,
    imageCoverUrlTemp,
    previousKahootTitle,
    previousKahootDescription,
    previousImageCoverUrl,
  ]);

  const handleNavigateProfile = useCallback(() => {
    navigate("/profile", {
      state: {
        routerPrincipal: state.routerPrincipal,
      },
    });
  }, []);

  const handleDeleteQuizModal = useCallback(() => {
    let quizTemp = [...quizData];
    if (flexibleClickedQuizIndex !== -1) {
      quizTemp.splice(flexibleClickedQuizIndex, 1);
      if (clickedQuizIndex === flexibleClickedQuizIndex) {
        setClickedQuizIndex((prevState) => {
          setQuizData([...quizTemp]);
          if (clickedQuizIndex === 0) {
            return prevState;
          }
          return prevState - 1;
        });
      } else {
        if (clickedQuizIndex < flexibleClickedQuizIndex) {
          setQuizData([...quizTemp]);
        } else if (clickedQuizIndex > flexibleClickedQuizIndex) {
          setClickedQuizIndex((prevState) => {
            setQuizData([...quizTemp]);
            return prevState - 1;
          });
        }
      }
    } else {
      quizTemp.splice(clickedQuizIndex, 1);
      setClickedQuizIndex((prevState) => {
        setQuizData([...quizTemp]);
        if (clickedQuizIndex === 0) {
          return prevState;
        }
        return prevState - 1;
      });
    }
    toggleModalJiggle();
  }, [isOpenModalJiggle, clickedQuizIndex, flexibleClickedQuizIndex, quizData]);

  useEffect(() => {
    if (!state?.routerPrincipal) {
      navigate("/");
      return;
    }
    IC.getBackend(async (result: any) => {
      setBackend(result);
    });
  }, []);
  return (
    <main className="background" ref={dropdownRef}>
      <LoadingLayover
        loading={loading || loadingFile || loadingCoverImage}
        description={
          loading
            ? state?.mode === "create"
              ? "Saving..."
              : "Updating..."
            : "Uploading file... Please wait..."
        }
      />
      {isMobileOrTablet && (
        <NavbarMobile
          handleNavigateProfile={handleNavigateProfile}
          handleEditQuizTitle={handleEditQuizTitle}
          kahootTitle={kahootTitle}
          handleSaveQuiz={handleSaveQuiz}
        />
      )}
      {!isMobileOrTablet && (
        <NavbarNonMobile
          handleNavigateProfile={handleNavigateProfile}
          handleEditQuizTitle={handleEditQuizTitle}
          kahootTitle={kahootTitle}
          handleSaveQuiz={handleSaveQuiz}
          handleExit={() => toggleModalExitKahoot()}
        />
      )}
      <div className="flex justify-between">
        {isMobileOrTablet && (
          <BottomQuizDataMobile
            bottomRef={bottomRef}
            setMouseEnterUl={setMouseEnterUl}
            mouseEnterUl={mouseEnterUl}
            quizData={quizData}
            setHoveredQuizIndex={setHoveredQuizIndex}
            clickedQuizIndex={clickedQuizIndex}
            setClickedQuizIndex={setClickedQuizIndex}
            hoveredQuizIndex={hoveredQuizIndex}
            handleAddQuestion={handleAddQuestion}
            loading={loading}
          />
        )}
        {!isMobileOrTablet && (
          <SidebarNonMobile
            bottomRef={bottomRef}
            setMouseEnterUl={setMouseEnterUl}
            mouseEnterUl={mouseEnterUl}
            quizData={quizData}
            setHoveredQuizIndex={setHoveredQuizIndex}
            clickedQuizIndex={clickedQuizIndex}
            setClickedQuizIndex={setClickedQuizIndex}
            hoveredQuizIndex={hoveredQuizIndex}
            handleCopyQuiz={handleCopyQuiz}
            handleDeleteQuiz={handleDeleteQuiz}
            handleAddQuestion={handleAddQuestion}
          />
        )}
        {!isMobileOrTablet && (
          <MiddleComponentNonMobile
            quizData={quizData}
            clickedQuizIndex={clickedQuizIndex}
            setQuizData={setQuizData}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            setIsOpen={setIsOpen}
            dragging={dragging}
            setMouseEnter1={setMouseEnter1}
            setMouseEnter2={setMouseEnter2}
            setMouseEnter3={setMouseEnter3}
            setMouseEnter4={setMouseEnter4}
            mouseEnter1={mouseEnter1}
            mouseEnter2={mouseEnter2}
            mouseEnter3={mouseEnter3}
            mouseEnter4={mouseEnter4}
          />
        )}
        {isMobileOrTablet && (
          <MiddleComponentMobile
            quizData={quizData}
            clickedQuizIndex={clickedQuizIndex}
            setQuizData={setQuizData}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            setIsOpen={setIsOpen}
            dragging={dragging}
            setMouseEnter1={setMouseEnter1}
            setMouseEnter2={setMouseEnter2}
            setOpenModalQuestion={setOpenModalQuestion}
            setIsChangingQuestionType={setIsChangingQuestionType}
            handleOpenChange={handleOpenChange}
            setCurrentTimeLimit={setCurrentTimeLimit}
            toggleModalTimeLimit={toggleModalTimeLimit}
            currentId={currentId}
            setCurrentId={setCurrentId}
            scrollToEnd={scrollToEnd}
            toggleModalJiggle={toggleModalJiggle}
            open={open}
          />
        )}
        {!isMobileOrTablet && (
          <RightSidebar
            quizData={quizData}
            clickedQuizIndex={clickedQuizIndex}
            setQuizData={setQuizData}
            toggleModalJiggle={toggleModalJiggle}
            setCurrentId={setCurrentId}
            currentId={currentId}
            scrollToEnd={scrollToEnd}
            handleOpenChange={handleOpenChange}
          />
        )}
      </div>
      <BouncyModal
        isOpenModal={isOpen}
        handleClose={() => toggleModalSecond()}
        innerDivClassName="bg-white rounded-lg shadow-lg w-[712px] text-center"
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
      >
        <UploadImageModalComponent
          handleFileChange={handleFileChange}
          dragging={dragging}
          toggleModalSecond={toggleModalSecond}
        />
      </BouncyModal>
      <JiggleModal
        isOpen={isOpenModalJiggle}
        onClose={toggleModalJiggle}
        outerDivClassName="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
        innerDivClassName="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
      >
        <DeleteModalComponent
          toggleModalJiggle={toggleModalJiggle}
          quizData={quizData}
          flexibleClickedQuizIndex={flexibleClickedQuizIndex}
          handleDeleteQuizModal={handleDeleteQuizModal}
        />
      </JiggleModal>
      <BouncyModal
        isOpenModal={openModalQuestion}
        handleClose={toggleModalQuestion}
        innerDivClassName="bg-white rounded-lg shadow-lg px-[32px] text-center"
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      >
        <QuestionModalComponent
          isChangingQuestionType={isChangingQuestionType}
          quizData={quizData}
          clickedQuizIndex={clickedQuizIndex}
          setQuizData={setQuizData}
          newQuizData={newQuizData}
          setCurrentId={setCurrentId}
          isMobileOrTablet={isMobileOrTablet}
          scrollToEnd={scrollToEnd}
          scrollToBottom={scrollToBottom}
          setIsChangingQuestionType={setIsChangingQuestionType}
          toggleModalQuestion={toggleModalQuestion}
        />
      </BouncyModal>
      <BouncyModal
        handleClose={() => {
          setFromSaving(false);
          toggleModalTitle();
        }}
        isOpenModal={isOpenModalTitle}
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        innerDivClassName="bg-white rounded-lg shadow-lg px-[16px] md:px-[32px] text-center w-[90vw] md:w-[600px]"
      >
        <TitleModalComponent
          kahootTitleTemp={kahootTitleTemp}
          setKahootTitleTemp={setKahootTitleTemp}
          imageCoverUrlTemp={imageCoverUrlTemp}
          fileInputRef={fileInputRef}
          handleCoverImage={handleCoverImage}
          draggingCoverImage={draggingCoverImage}
          kahootDescriptionTemp={kahootDescriptionTemp}
          setKahootDescriptionTemp={setKahootDescriptionTemp}
          setKahootTitle={setKahootTitle}
          setPreviousKahootTitle={setPreviousKahootTitle}
          setFromSaving={setFromSaving}
          toggleModalTitle={toggleModalTitle}
          setImageCoverUrlTemp={setImageCoverUrlTemp}
          fromSaving={fromSaving}
          previousKahootTitle={previousKahootTitle}
          previousKahootDescription={previousKahootDescription}
          previousImageCoverUrl={previousImageCoverUrl}
          setKahootDescription={setKahootDescription}
          setPreviousImageCoverUrl={setPreviousImageCoverUrl}
          setImageCoverUrl={setImageCoverUrl}
          setPreviousKahootDescription={setPreviousKahootDescription}
          setLoading={setLoading}
          addOrUpdateGame={addOrUpdateGame}
        />
      </BouncyModal>
      <JiggleModal
        isOpen={isOpenExitKahootModal}
        onClose={toggleModalExitKahoot}
        outerDivClassName="fixed z-infinite inset-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center z-10000"
        innerDivClassName="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
      >
        <ExitKahootModalComponent
          toggleModalExitKahoot={toggleModalExitKahoot}
          navigate={navigate}
          state={state}
        />
      </JiggleModal>
      <BouncyModal
        isOpenModal={isOpenModalValidate}
        handleClose={toggleModalValidate}
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        innerDivClassName="bg-white rounded-lg shadow-lg text-center h-full md:h-[95vh] flex flex-col gap-y-4 w-[100vw] md:w-[640px]"
      >
        <ValidateModalComponent
          quizChecked={quizChecked}
          quizData={quizData}
          setClickedQuizIndex={setClickedQuizIndex}
          toggleModalValidate={toggleModalValidate}
        />
      </BouncyModal>
      <BouncyModal
        isOpenModal={isOpenModalTimeLimit}
        handleClose={toggleModalTimeLimit}
        outerDivClassName="fixed z-infinite top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
        innerDivClassName="bg-white rounded-lg shadow-lg text-center md:h-[95vh] flex flex-col gap-y-4 w-[90vw] md:w-[640px]"
      >
        <TimeLimitModalComponent
          timeLimitData={timeLimitData}
          setCurrentTimeLimit={setCurrentTimeLimit}
          currentTimeLimit={currentTimeLimit}
          quizData={quizData}
          clickedQuizIndex={clickedQuizIndex}
          setQuizData={setQuizData}
          toggleModalTimeLimit={toggleModalTimeLimit}
        />
      </BouncyModal>
    </main>
  );
}

export default Create;

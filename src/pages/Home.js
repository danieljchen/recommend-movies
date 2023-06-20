import React, { useState, useEffect } from "react";
import { fetchAllData, convertToArrayAndSortByTitle, getRecommendations } from '../api';

function Home(props) {
    // =========
    // STATE
    // =========
    const [movies, setMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [topPicks, setTopPicks] = useState([]);
    const [remainingPicks, setRemainingPicks] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // =========
    // FUNCTIONS
    // =========
    const resetSelected = () => {
        setSelectedMovies([]);
        setRemainingPicks([]);
        setTopPicks([]);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        resetSelected();
    };

    const handleMovieClick = (m) => {
        const isSelected = selectedMovies.some((sm) => parseInt(sm.id, 10) === parseInt(m.id, 10));
        if (isSelected) {
            setSelectedMovies(selectedMovies.filter((sm) => sm.id !== m.id));
        } else {
            setSelectedMovies([...selectedMovies, m]);
        }
    };

    async function fetchRecommendations() {
        try {
            // Expects an array of integer IDs [1,2,3,4,5]
            const selected = selectedMovies.map((m) => parseInt(m.id, 10));
            if (selected.length > 0) {
                const data = await getRecommendations(selected);
                // TODO: Remove this console.log
                console.log("DID WE GET RECOMMENDATIONS? ", data);
                if (data) {
                    if (data.length > 3) {
                        // Set first 3 recommendations
                        setTopPicks(data.slice(0, 3));
                        // Set remaining recommendations
                        setRemainingPicks(data.slice(3));
                    } else {
                        setTopPicks(data);
                    }
                }
                setIsOpen(false);
            } else {
                alert("Please select at least one movie.");
            }
        } catch (error) {
            console.log("ERROR IN FETCHING RECOMMENDATIONS: ", error);
        }
    }

    // =========
    // PAGE LOAD
    // =========
    useEffect(() => {
        const fetchAllMovies = async () => {
            // Fetch movies from JSON server
            const response = await fetchAllData();
            const allMovies = await convertToArrayAndSortByTitle(response.movieData);
            console.log("SUCCESSFULLY LOADED MOVIES: ", allMovies.length);
            setMovies(allMovies);
        }
        fetchAllMovies();
    }, []);

    return (
        <>
            <main>
                <div
                className="relative flex content-center items-center justify-center pt-16 pb-32"
                style={{
                    minHeight: "75vh",
                }}
                >
                    <div
                        className="absolute top-0 h-full w-full bg-cover bg-center"
                        style={{
                        backgroundImage: "url('/movies-hero.png')",
                        }}
                    >
                        <span
                        id="blackOverlay"
                        className="absolute left-0 h-full w-full bg-neutral-900 opacity-50"
                        ></span>
                    </div>
                    <div className="container relative mx-auto">
                        <div className="flex flex-wrap items-center">
                            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
                                <div className="mt-8">
                                <h1 className="text-3xl font-light text-white sm:text-5xl">
                                    Let's Get Watching!
                                </h1>
                                </div>
                                <div className="flex justify-center justify-items-center py-6 text-white">
                                    <button onClick={openModal} className="rounded-full bg-indigo-500 text-white py-2 px-6 shadow-lg">
                                        FIND RECOMMENDATIONS
                                    </button>
                                </div>
                                {selectedMovies && selectedMovies.length > 0 && (
                                    <>
                                        {selectedMovies.map((m) => (
                                            <span key={m.id} className="bg-indigo-200 text-indigo-600 py-2 px-4 mr-3 mb-4 rounded-md inline-block shadow-md">{m.title}</span>
                                        ))}
                                        {topPicks && topPicks.length < 1 ? (
                                            <p className="mt-4 text-lg text-yellow-200">
                                                We're very sorry, but we are not able to make any recommendations based on your selections.
                                            </p>
                                        ) : (
                                            <p className="mt-4 text-xl text-white">
                                                Based on your selections, we found some movie suggestons you might like.
                                            </p>
                                        )}
                                        
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <section className="-mt-24 bg-primary-200 pb-20">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap">
                            {topPicks && topPicks.length > 0 && (
                                topPicks.map((movie, index) => (
                                    <div key={movie.id} className="w-full px-4 pt-6 text-center md:w-4/12 lg:pt-12">
                                        <div className="relative mb-8 flex w-full min-w-0 flex-col break-words rounded-lg bg-amber-50 shadow-lg">
                                            <div className="flex-auto px-4 py-5">
                                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 p-3 text-center text-neutral-50 shadow-lg">
                                                {index + 1}
                                                </div>
                                                <h6 className="text-xl font-medium uppercase text-yellow-600">
                                                    Top Pick
                                                </h6>
                                                <p className="mt-2 mb-4 text-neutral-800 font-bold text-2xl">
                                                    {movie.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {remainingPicks && remainingPicks.length > 0 && (
                        <div className="container mx-auto px-4">
                            {remainingPicks.map((movie, index) => (
                                <p key={movie.id} className="text-3xl mb-4">{movie.title}</p>
                            ))}
                        </div>
                    )}
                </section>

                <section className="relative block bg-black pb-20">
                <div
                    className="pointer-events-none absolute bottom-auto top-0 left-0 right-0 -mt-20 w-full overflow-hidden"
                    style={{ height: "80px" }}
                >
                    <svg
                    className="absolute bottom-0 overflow-hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    version="1.1"
                    viewBox="0 0 2560 100"
                    x="0"
                    y="0"
                    >
                    <polygon
                        className="fill-current text-black"
                        points="2560 0 2560 100 0 100"
                    ></polygon>
                    </svg>
                </div>
                <div className="container mx-auto px-4 lg:pt-24 lg:pb-64">
                    <div className="flex flex-wrap text-center justify-center">
                    <div className="w-full lg:w-6/12 px-4">
                        <h2 className="text-5xl font-semibold text-neutral-50">
                            Thanks for the opportunity!
                        </h2>
                        <p className="text-sm mt-6">
                        <span className="text-zinc-200">Copyright &copy; {new Date().getFullYear()}{" "} Daniel Chen</span>
                        </p>
                    </div>
                    <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
                        &nbsp;
                    </div>
                    </div>
                </div>
                </section>
            </main>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-amber-100 w-screen max-w-screen-md mx-auto rounded-lg shadow-lg p-6 h-3/4 overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Select Movies That You've Watched & Liked</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-3/4 overflow-y-auto text-left">
                            {movies && movies.length > 0 && (
                                <>
                                {movies.map((movie) => (
                                    <span
                                        key={movie.id}
                                        className={`cursor-pointer hover:text-indigo-400 ${
                                        selectedMovies.some((sm) => parseInt(sm.id, 10) === parseInt(movie.id, 10)) ? "font-bold text-blacl" : "font-normal text-indigo-800"
                                        }`}
                                        onClick={() => handleMovieClick(movie)}
                                    >
                                    {movie.title}
                                    </span>
                                ))}
                                </>
                            )}
                        </div>
                        <div className="mt-6 sticky bottom-0">
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                <button onClick={fetchRecommendations} className="px-4 py-2 bg-indigo-500 text-white rounded uppercase">Recommend Me Some Movies!</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button onClick={resetSelected} className="px-4 py-2 bg-slate-500 text-white rounded">Reset</button>
                                <button onClick={closeModal} className="px-4 py-2 bg-slate-300 text-slate-700 rounded">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
import React from "react";




const GenreFilterDropdown = (props) => {
    const {genreList, filterByGenres  } = props;

    const myFunction = () => {
        const dropdownElement = document.getElementById("myDropdown");

        if (dropdownElement) { // Check if dropdownElement is not null
            const currentDisplay = dropdownElement.style.display;
            console.log(currentDisplay)

            if (currentDisplay === "none") {
                dropdownElement.style.display = "inline";
            } else {
                dropdownElement.style.display = "none";
            }
        }
    }

    const filterFunction = () => {
        const input = document.getElementById("myInput")as HTMLInputElement;
        const filter = input?.value.toUpperCase();
        const div = document.getElementById("myDropdown");
        let a = div?.getElementsByTagName("span");
        console.log(a)
        if (a !== undefined){
            for (let i = 0; i < a.length; i++) {
                const txtValue = a[i].textContent || a[i].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    a[i].style.display = "";
                } else {
                    a[i].style.display = "none";
                }
            }
        }
    }

    return (
        <div className='dropdown'>
            <button
                onClick={(e) => {
                    console.log("button called")
                    myFunction();
                }}
                className="dropbtn"
            >
                Filter by genre
            </button>

            <div
                style={{
                    overflow: "scroll",
                    maxHeight: "500px",
                }}
                id="myDropdown"
                className="dropdown-content"
            >
                <input
                    type="text"
                    placeholder="Search.."
                    id="myInput"
                    onKeyUp={(e) => {
                        filterFunction();
                    }}
                />
                {genreList.map((genre) => {
                    return (
                        <span>
                            <input
                                style={{width: "20px", height: "20px"}}
                                type="checkbox"
                                id={genre.genre}
                                name={genre.genre}
                                value={genre.genre}
                                onClick={(e) => {
                                    filterByGenres();
                                }}
                            />
                            <label htmlFor={genre.genre}>{genre.genre}</label>
                            <br></br>
                        </span>
                    );
                })}
            </div>

        </div>
    )
}

export default GenreFilterDropdown
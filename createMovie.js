export function movieCreation(title, img, seats) {
    if (title !== '' && img !== '' && seats !== '' && seats < 11 && img.includes('https://') && title.length < 10) {
        const existingMovie = localStorage.getItem(`movie_${title}`);
        if (!existingMovie) {
            const movie = {
                title: title,
                img: img,
                seats: Array.from({ length: seats }, () => ({ reserved: false, reservedBy: null })) // Initialize seats
            };

            const movieJSON = JSON.stringify(movie);
            localStorage.setItem(`movie_${title}`, movieJSON);

            console.log('Movie created:', movie);

            location.reload();
        } else {
            console.log('A movie with the same title already exists.');
        }
    } else if (seats > 10) {
        alert('Maximum seat capacity is 10! It’s not a big theatre... :(');
    } else if (!(img.includes('https://')) && title !== '' && seats !== '') {
        alert('Image URL has to be correct. https://...');
    } else if (title.length > 10) {
        alert('Title can’t be longer than 10 letters!');
    } else {
        alert('All fields are required.');
    }
}

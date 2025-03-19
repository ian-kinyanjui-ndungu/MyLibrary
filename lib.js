const myLibrary = [];

function Book(title, author, pages, read, coverUrl) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.coverUrl = coverUrl || '';
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read, coverUrl) {
    const newBook = new Book(title, author, pages, read, coverUrl);
    myLibrary.push(newBook);
    return newBook;
}

function displayBooks() {
    const libraryContainer = document.getElementById('library-container');
    libraryContainer.innerHTML = '';

    myLibrary.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.dataset.id = book.id;

        // Create book cover image or placeholder
        const coverImage = document.createElement('div');
        if (book.coverUrl) {
            const img = document.createElement('img');
            img.src = book.coverUrl;
            img.alt = `${book.title} cover`;
            img.classList.add('book-cover');
            img.onerror = function() {
                this.onerror = null;
                this.src = '';
                this.alt = 'Image not available';
                this.classList.add('no-image');
                this.textContent = 'Cover image not available';
            };
            coverImage.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.classList.add('book-cover', 'no-image');
            placeholder.textContent = 'No cover image';
            coverImage.appendChild(placeholder);
        }

        const title = document.createElement('h3');
        title.textContent = book.title;

        const author = document.createElement('p');
        author.textContent = `Author: ${book.author}`;

        const pages = document.createElement('p');
        pages.textContent = `Pages: ${book.pages}`;

        const readStatus = document.createElement('p');
        readStatus.classList.add('read-status');
        readStatus.classList.add(book.read ? 'read' : 'not-read');
        readStatus.textContent = book.read ? 'Read' : 'Not Read';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeBook(book.id));

        const toggleReadButton = document.createElement('button');
        toggleReadButton.textContent = 'Toggle Read';
        toggleReadButton.addEventListener('click', () => toggleReadStatus(book.id));

        buttonsDiv.appendChild(removeButton);
        buttonsDiv.appendChild(toggleReadButton);

        bookCard.appendChild(coverImage);
        bookCard.appendChild(title);
        bookCard.appendChild(author);
        bookCard.appendChild(pages);
        bookCard.appendChild(readStatus);
        bookCard.appendChild(buttonsDiv);

        libraryContainer.appendChild(bookCard);
    });
}

function removeBook(id) {
    const index = myLibrary.findIndex(book => book.id === id);
    if (index !== -1) {
        myLibrary.splice(index, 1);
        displayBooks();
    }
}

function toggleReadStatus(id) {
    const book = myLibrary.find(book => book.id === id);
    if (book) {
        book.toggleRead();
        displayBooks();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const newBookBtn = document.getElementById('new-book-btn');
    const bookFormDialog = document.getElementById('book-form-dialog');
    const bookForm = document.getElementById('book-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const coverInput = document.getElementById('cover');
    const coverPreview = document.getElementById('cover-preview');
    const previewPlaceholder = document.getElementById('preview-placeholder');

    coverInput.addEventListener('input', () => {
        const imageUrl = coverInput.value.trim();
        if (imageUrl) {
            coverPreview.style.display = 'block';
            previewPlaceholder.style.display = 'none';
            coverPreview.src = imageUrl;
            coverPreview.onerror = function() {
                this.style.display = 'none';
                previewPlaceholder.style.display = 'block';
                previewPlaceholder.textContent = 'Invalid image URL';
            };
        } else {
            coverPreview.style.display = 'none';
            previewPlaceholder.style.display = 'block';
            previewPlaceholder.textContent = 'Image preview will appear here';
        }
    });

    newBookBtn.addEventListener('click', () => {
        bookFormDialog.showModal();
    });

    cancelBtn.addEventListener('click', () => {
        bookFormDialog.close();
        bookForm.reset();
        coverPreview.style.display = 'none';
        previewPlaceholder.style.display = 'block';
        previewPlaceholder.textContent = 'Image preview will appear here';
    });

    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = parseInt(document.getElementById('pages').value);
        const read = document.getElementById('read').checked;
        const coverUrl = document.getElementById('cover').value.trim();

        addBookToLibrary(title, author, pages, read, coverUrl);
        displayBooks();
        
        bookFormDialog.close();
        bookForm.reset();
        coverPreview.style.display = 'none';
        previewPlaceholder.style.display = 'block';
        previewPlaceholder.textContent = 'Image preview will appear here';
    });

    // Add sample books with cover images
    addBookToLibrary(
        'The Hobbit', 
        'J.R.R. Tolkien', 
        295, 
        true,
        'https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg'
    );
    
    addBookToLibrary(
        '1984', 
        'George Orwell', 
        328, 
        false,
        'https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg'
    );
    
    addBookToLibrary(
        'To Kill a Mockingbird', 
        'Harper Lee', 
        281, 
        true,
        'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
    );
    
    displayBooks();
});
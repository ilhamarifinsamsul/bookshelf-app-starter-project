document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKSHELF_APP";
  let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function createBookElement(book) {
    const bookDiv = document.createElement("div");
    bookDiv.setAttribute("data-bookid", book.id);
    bookDiv.setAttribute("data-testid", "bookItem");

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.innerText = book.title;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.innerText = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(deleteButton);

    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(year);
    bookDiv.appendChild(buttonContainer);

    return bookDiv;
  }

  function addBook(title, author, year, isComplete) {
    const newBook = {
      id: +new Date(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };
    books.push(newBook);
    saveBooks();
    renderBooks();
  }

  function toggleBookStatus(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooks();
      renderBooks();
    }
  }

  function deleteBook(bookId) {
    books = books.filter((b) => b.id !== bookId);
    saveBooks();
    renderBooks();
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchQuery = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery)
    );
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  });

  renderBooks();
});

const form = document.getElementById("comment-form");
const commentError = document.getElementById("comment-error");

commentError.hidden = true;

form.addEventListener("submit", (e) => {
  const comment = e.target.comment.value;
  if (comment.trim().length === 0) {
    commentError.hidden = false;
    e.preventDefault();
  } else {
    commentError.hidden = true;
  }
});

// Gallery modal control
function openModal(element) {
    console.log('click', element.src);
    document.getElementById('modalImage').src = element.src;
    document.getElementById('modal').style.display = "flex";
}
// End Gallery modal control

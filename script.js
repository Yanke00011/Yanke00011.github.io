function openModal(imgElement) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = imgElement.src;
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

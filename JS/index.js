/*
 Steps :
Step-1: Fetch and Load 
Step-2: Display
 
 */


// Get time string Function
function getTimeString(time) {
    const hour = parseInt(time / 3600);
    const remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    return `${hour} hr ${minute} min ago`

}

// Class Remover Function
const removeBtnClass = () => {
    const buttons = document.getElementsByClassName('category-btn')
    for (btn of buttons) {
        btn.classList.remove('active')
    }
}

// Load Categories
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(error => console.log(error))
}

// Load Videos
const loadVideos = (searchText = '') => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch(error => console.log(error))
}

// Load Details
const loadDetails = async (videoId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    const res = await fetch(url);
    const data = await res.json();
    displayModal(data.video)
}

// Display Categories 
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('category-container')
    categories.forEach(item => {
        const categoryName = item.category
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML =
            `
        <button onclick="displayCategoriesVideos(${item.category_id})"  id="btn-${item.category_id}"  class="btn btn-wide btn-outline category-btn">
        ${categoryName}
        </button>
        `
        categoryContainer.appendChild(buttonContainer)
    });
}

// Display Category based Videos
const displayCategoriesVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then(res => res.json())
        .then(data => {
            const activeBtn = document.getElementById(`btn-${id}`)
            // Remove class
            removeBtnClass()

            // Add class
            activeBtn.classList.add('active')
            displayVideos(data.category)
        })
        .catch(error => console.log(error))
}

// Display Videos
const displayVideos = (videos) => {
    const videosContainer = document.getElementById('videos-container')
    videosContainer.innerHTML = ``

    if (videos.length === 0) {
        videosContainer.classList.remove('grid')
        videosContainer.innerHTML =
            `
        <div class="flex flex-col justify-center items-center min-w-[300px] pt-8">
            <img src="./Assates/Icon.png" alt="">
            <h2 class="text-center pt-3 text-xl font-bold">Opss!! <br> There is no content Here</h2>
        </div>
        `
    }
    else {
        videosContainer.classList.add('grid')

    }
    videos.forEach(video => {
        console.log(video)
        const card = document.createElement('div')
        card.classList = 'card card-compact shadow-xl'
        card.innerHTML =
            `
        <figure class="h-[180px] relative">
        <img src= ${video.thumbnail} class ="w-full h-full rounded-xl"/>
        ${video.others.posted_date?.length === 0 ? '' : `<span class="bg-black text-white p-1 text-xs absolute right-2 bottom-2">${getTimeString(video.others.posted_date)}</span>`}
        </figure>
        <div class="flex gap-2 py-2 pl-2">
            <div class="h-[30px] w-[30px]">
                <img src= ${video.authors[0].profile_picture} class ="rounded-full w-full h-full"/>
            </div>
            <div class="">
                <h2 class="card-title font-bold">${video.title}</h2>
                <div class ="flex justify-between gap-2">
                <div>
                <div class="flex gap-2 items-center">
                <p class="text-gray-700">${video.authors[0].profile_name}</p>
                ${video.authors[0].verified === true ? '<img src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png" class="h-[20px] w-[20px] rounded-full"/>' : ''}
                </div>
                <p>${video.others.views} Views</p>
                </div>
                <button onclick="loadDetails('${video.video_id}')" class= "btn btn-sm btn-outline mt-2 btn-error">Details</button>
                </div>
                
            </div>
        </div>
        `
        videosContainer.appendChild(card)
    })
}
// Display Modal
const displayModal = (video) => {
    document.getElementById('modalButton').click();
    const modalContent = document.getElementById('modal-container');
    modalContent.innerHTML= `
    <div class="flex flex-col gap-3 justify-center items-center"> 
    <img class="w-full" src="${video.thumbnail}" />
    <p>  <span class="font-bold">Description :</span> ${video.description}</p>
    </div>
    `
}

document.getElementById('search-box').addEventListener('keyup', (e) => {
    loadVideos(e.target.value)
})
// Call Function
loadCategories()
loadVideos()
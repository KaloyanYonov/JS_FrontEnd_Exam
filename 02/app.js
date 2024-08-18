window.addEventListener("load", solve);

function solve() {
    const addButton = document.getElementById('add-btn');
    const previewList = document.getElementById('preview-list');
    const archiveList = document.getElementById('archive-list');

    const nameInput = document.getElementById('name');
    const timeInput = document.getElementById('time');
    const descriptionInput = document.getElementById('description');


    addButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const time = timeInput.value.trim();
        const description = descriptionInput.value.trim();

        if (name === '' || time === '' || description === '') {
            return;
        }

        const eventElement = createEventElement(name, time, description);

        previewList.appendChild(eventElement);
        clearInputs();
        addButton.disabled = true;
    });

    function clearInputs() {
        nameInput.value = '';
        timeInput.value = '';
        descriptionInput.value = '';
    }

    function createEventElement(name, time, description) {
        const nameP = document.createElement('p');
        nameP.textContent = name;

        const timeP = document.createElement('p');
        timeP.textContent = time;

        const descP = document.createElement('p');
        descP.textContent = description;

        const article = document.createElement('article');
        article.appendChild(nameP);
        article.appendChild(timeP);
        article.appendChild(descP);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', editEvent);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = 'next-btn';
        nextButton.addEventListener('click', moveToArchive);

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'buttons';
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(nextButton);

        const listItem = document.createElement('li');
        listItem.appendChild(article);
        listItem.appendChild(buttonDiv);

        return listItem;
    }

    function editEvent(e) {
        const listItem = e.target.parentElement.parentElement;
        const [nameP, timeP, descP] = listItem.getElementsByTagName('article')[0].getElementsByTagName('p');

        nameInput.value = nameP.textContent;
        timeInput.value = timeP.textContent;
        descriptionInput.value = descP.textContent;

        previewList.removeChild(listItem);
        addButton.disabled = false; 
    }

    function moveToArchive(e) {
        const listItem = e.target.parentElement.parentElement;
        const buttonsDiv = listItem.querySelector('.buttons');
        buttonsDiv.remove();

        const archiveButton = document.createElement('button');
        archiveButton.textContent = 'Archive';
        archiveButton.className = 'archive-btn';
        archiveButton.addEventListener('click', archiveEvent);

        listItem.appendChild(archiveButton);

        archiveList.appendChild(listItem);
    }

    function archiveEvent(e) {
        const listItem = e.target.parentElement;
        listItem.remove();
        addButton.disabled = false;
    }
}

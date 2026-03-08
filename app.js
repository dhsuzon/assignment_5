const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = [];


async function fetchIssues() {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('issue-grid').innerHTML = '';  

    try {
        const res = await fetch(`${API_URL}/issues`);
        const result = await res.json();
        
        allIssues = result.data || result; 
        console.log("All issues loaded:", allIssues.length, allIssues);

        if (Array.isArray(allIssues)) {
            renderIssues(allIssues);
        } else {
            console.error("API did not return an array:", result);
        }
    } catch (err) {
        console.error("Data Load Error:", err);
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
}


function HTMLBadgeLables(labels) {
    if (Array.isArray(labels) && labels.length > 0) {
        return labels.map(l => `
            <span class="badge badge-ghost bg-[#FFF8DB] py-2 px-2 text-[#D97706] font-medium text-xs uppercase border">
                ${l}
            </span>
        `).join('');
    } else {
        return `<span class="badge badge-ghost badge-md py-2 px-2 text-gray-400 font-bold uppercase border border-gray-200">No label</span>`;
    }
}


function renderIssues(data) {
    const grid = document.getElementById('issue-grid');
    const countDisplay = document.getElementById('total-count');

    if (!grid) return;
    grid.innerHTML = '';

    if (countDisplay) countDisplay.innerText = data.length;

    if (data.length === 0) {
        grid.innerHTML = '<p class="text-center text-gray-500 col-span-full py-10">No issues found</p>';
        return;
    }

    data.forEach(issue => {
        const isOpen = issue.status?.toLowerCase() === 'open';
        const createDate = new Date(issue.createdAt).toLocaleDateString("en-US");

        const borderClass = isOpen ? 'border-t-[#00A96E]' : 'border-t-[#A855F7]';
        const statusIcon = isOpen ? 'assets/Open-Status.png' : 'assets/Closed-Status.png';

        let priorityClass = "bg-gray-100 text-gray-500 text-xs";
        const priority = issue.priority?.toLowerCase() || 'low';

        if (priority === 'high') priorityClass = "bg-[#FEECEC] text-[#EF4444] text-xs";
        else if (priority === 'medium') priorityClass = "bg-[#FFF6D1] text-[#F59E0B] text-sm";
        else priorityClass = "bg-[#EEEFF2] text-[#9CA3AF] text-sm";

        const card = document.createElement('div');
        card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 rounded-t-4 ${borderClass} cursor-pointer hover:shadow-md transition-all h-full`;

        card.innerHTML = `
            <div class="card-body p-5 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <img src="${statusIcon}" class="w-5 h-5" alt="status">
                        <span class="w-20 font-medium py-1.5 text-center rounded-full uppercase ${priorityClass}">
                            ${issue.priority || 'Low'}
                        </span>
                    </div>

                    <h2 class="card-title text-sm text-[#1F2937] font-semibold mt-3 text-wrap" title="${issue.title}">
                        ${issue.title || 'No title'}
                    </h2>

                    <p class="font-normal text-xs text-[#64748B] line-clamp-2 mt-2">
                        ${issue.description || 'No description'}
                    </p>
                </div>

                <div class="flex gap-1 flex-wrap mt-3">
                    ${HTMLBadgeLables(issue.labels)}
                </div>

                <div class="border-t pt-3 mt-3">
                    <div class="flex justify-between items-center text-[10px]">
                        <div class="flex items-center gap-1">
                            <span class="font-normal text-xs text-[#64748B]">#1 by ${issue.author || 'Unknown'}</span>
                        </div>
                    </div>
                    <span class="font-normal text-xs text-[#64748B]">${createDate}</span>
                </div>
            </div>
        `;

        card.onclick = () => showIssueModal(issue.id);
        grid.appendChild(card);
    });
}


const tabContainer = document.getElementById('tab-container');

tabContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('active-btn')) {
        
        document.querySelectorAll('.active-btn').forEach(t => {
            t.classList.remove('tab-active', 'font-bold');
        });

        
        e.target.classList.add('tab-active', 'font-bold');

        const status = e.target.getAttribute('data-status');

      
        const loader = document.getElementById('loader');
        const grid = document.getElementById('issue-grid');

        if (loader) loader.classList.remove('hidden');
        if (grid) grid.innerHTML = '';

      
        let filteredIssues = allIssues;
        if (status !== 'all') {
            filteredIssues = allIssues.filter(issue => 
                issue.status?.toLowerCase() === status.toLowerCase()
            );
        }

        
        setTimeout(() => {
            renderIssues(filteredIssues);
            if (loader) loader.classList.add('hidden');
        }, 500);
    }
});

async function showIssueModal(id) {
    try {
        const res = await fetch(`${API_URL}/issue/${id}`);
        const result = await res.json();
        const issue = result.data || result;

        const isGreen = issue.status?.toLowerCase() === 'open';
        const borderColor = isGreen ? 'border-[#00A96E]' : 'border-[#A855F7]';
        const statusBadge = isGreen ? 'bg-[#00A96E] text-white' : 'bg-[#A855F7] text-white';

        const createDate = new Date(issue.createdAt).toLocaleDateString('en-US');
        const updatedDate = issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString('en-US') : createDate;

        let priorityClass = 'bg-gray-100 text-gray-600';
        const priority = (issue.priority || 'LOW').toUpperCase();
        if (priority === 'HIGH') priorityClass = 'bg-[#EF4444] text-white';
        if (priority === 'MEDIUM') priorityClass = 'bg-[#D97706] text-white';
        if (priority === 'LOW') priorityClass = 'bg-[#10B981] text-white';

        const container = document.getElementById('modal_container');
        container.className = `modal-box w-11/12 max-w-2xl p-8 rounded-lg border-t-4 ${borderColor} bg-white shadow-2xl relative`;

        const content = document.getElementById('modal_content');
        content.innerHTML = `
            <div class="">
                <h2 class="font-bold text-2xl text-[#1F2937]">${issue.title || 'No title'}</h2>

                <div class="flex items-center gap-3 mt-4">
                    <span class="badge px-2 py-1.5 ${statusBadge} font-bold">${issue.status || 'Unknown'}</span>
                    <span class="font-normal text-sm text-[#1F2937]">
                        Opened by ${issue.author?.trim() || 'Unknown'}
                    </span>
                    <span class="text-xs font-normal text-[#64748B]">
                        ${createDate}
                    </span>
                </div>

                <div class="my-6">
                    ${HTMLBadgeLables(issue.labels)}
                </div>

                <p class="font-normal text-base text-[#64748B] text-wrap my-6">
                    ${issue.description || 'No description provided.'}
                </p>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-xl text-center mt-8">
                    <div>
                        <p class="font-normal text-base text-[#64748B]">Assignee</p>
                        <p class="font-semibold text-base text-[#1F2937]">${issue.assignee || 'Not assigned'}</p>
                    </div>
                    <div>
                        <p class="font-normal text-base text-[#64748B]">Priority</p>
                        <p class="font-medium text-white text-xs text-center rounded-full w-[60%] mx-auto py-1.5 px-4 ${priorityClass}">
                            ${priority}
                        </p>
                    </div>
                    <div>
                        <p class="font-normal text-base text-[#64748B]">Author</p>
                        <p class="font-bold text-xs mt-1">${issue.author || 'Unknown'}</p>
                    </div>
                    <div>
                        <p class="font-normal text-base text-[#64748B]">Updated</p>
                        <p class="font-bold text-xs mt-1">${updatedDate}</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('my_modal_1').showModal();
    } catch (err) {
        console.error("Modal Data Error:", err);
        alert("Failed to load issue details");
    }
}


document.getElementById('search-btn').onclick = async () => {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return renderIssues(allIssues);

    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('issue-grid').innerHTML = '';

    try {
        const res = await fetch(`${API_URL}/issues/search?q=${encodeURIComponent(query)}`);
        const result = await res.json();
        const data = result.data || result;
        renderIssues(data);
    } catch (err) {
        console.error("Search Error:", err);
        alert("Search failed");
    } finally {
        document.getElementById('loader').classList.add('hidden');
    }
};


fetchIssues();
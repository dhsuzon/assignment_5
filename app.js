const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = [];


async function fetchIssues(status = 'all') {
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('issue-grid').innerHTML = '';  

    let url = `${API_URL}/issues`;
    if (status !== 'all') {
        url += `?status=${status}`;
    }

    try {
        const res = await fetch(url);
        const result = await res.json();
        
        allIssues = result.data || result; 

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
function HTMLBadgeLables(htmlBadges){
   
        if (Array.isArray(htmlBadges)) {
            labelsHTML = htmlBadges.map(l => `
                <span class="badge badge-ghost  bg-[#FFF8DB]  py-2 px-2 text-[#D97706] font-medium text-xs uppercase border">
                    ${l}
                </span>
            `)
        } else {
            return `<span class="badge badge-ghost badge-md py-2 px-2 text-gray-400 font-bold uppercase border border-gray-200">${issue.label || ''}</span>`;
        }
    return labelsHTML.join('');
}


function renderIssues(data) {
    const grid = document.getElementById('issue-grid');
    const countDisplay = document.getElementById('total-count');
    
    if (!grid) return;
    grid.innerHTML = '';
    if (countDisplay) countDisplay.innerText = data.length;

    data.forEach(issue => {
        const isOpen = issue.status.toLowerCase() === 'open';
        const createDateFormat = new Date(issue.createdAt).toLocaleDateString("en-US");
        
      
        const borderClass = isOpen ? 'border-t-[#00A96E]' : 'border-t-[#A855F7]';
        const statusIcon = isOpen ? 'assets/Open-Status.png' : 'assets/Closed-Status.png';

       
        let priorityClass = "bg-gray-100 text-gray-500"; 
        const priority = issue.priority ? issue.priority.toLowerCase() : 'low';

        if (priority === 'high') {
            priorityClass = "bg-[#FEECEC] text-[#EF4444]  text-xs";
        } else if (priority === 'medium') {
            priorityClass = "bg-[#FFF6D1] text-[#F59E0B] text-sm";
        } else {
            priorityClass =  "bg-[#EEEFF2] text-[#9CA3AF] text-sm"; 
        }


        const card = document.createElement('div');
        
        card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 rounded-t-4 ${borderClass} cursor-pointer hover:shadow-md transition-all h-full`;
        
        card.innerHTML = `
            <div class="card-body p-5 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-3">
                        <img src="${statusIcon}" class="w-5 h-5" alt="status">
                        <span class="w-20 font-medium py-1.5 text-center rounded-full uppercase ${priorityClass}">
                            ${issue.priority}
                        </span>
                    </div>

                    <h2 class="card-title text-sm text-[#1F2937] font-semibold mt-3 text-wrap" title="${issue.title}">
                        ${issue.title}
                    </h2>

                    <p class="font-normal text-xs text-[#64748B] line-clamp-2 mt-2">
                        ${issue.description}
                    </p>
                    
                </div>
                <div class="flex gap-1 flex-wrap ">
                         ${HTMLBadgeLables(issue.labels)}
                    </div>

                <div class="border-t pt-3">
                    
                    <div class="flex justify-between items-center text-[10px]">
                        <div class="flex items-center gap-1">
                            <span class="font-normal text-xs text-[#64748B]">#1 by ${issue.author}</span>
                           
                        </div>

                    </div>
                    <span class="font-normal text-xs text-[#64748B]">${createDateFormat }</span>

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
       
        document.querySelectorAll('.active-btn').forEach(t => t.classList.remove('tab-active', 'font-bold'));
        
        e.target.classList.add('tab-active', 'font-bold');

        const status = e.target.getAttribute('data-status');
        
        fetchIssues(status);
    }
});

async function showIssueModal(id) {
    try {
        const res = await fetch(`${API_URL}/issue/${id}`);
        const result = await res.json();
        const issue = result.data || result;


        const isGreen = issue.status.toLowerCase() === 'open';
        const borderColor = isGreen ? 'border-[#00A96E]' : 'border-[#A855F7]';
        const statusBadge = isGreen ? 'bg-[#00A96E] text-white' : 'bg-[#A855F7] text-white';
       const createDateFormatDate= new Date(issue.createdAt).toLocaleDateString('en-US').trim();
       const updatedAtDateFormatDate= new Date(issue.updatedAt).toLocaleDateString('en-US')

      
        let priorityClass = 'bg-gray-100 text-gray-600';
        const priority = (issue.priority || 'LOW').toUpperCase();
        if (priority === 'HIGH') priorityClass = 'bg-[#EF4444] ';
        if (priority === 'MEDIUM') priorityClass = 'bg-[#D97706]';
        if (priority === 'LOW') priorityClass = 'bg-[#10B981]';

        
        const container = document.getElementById('modal_container');
        container.className = `modal-box w-11/12 max-w-2xl p-8 rounded-lg border-t-4 ${borderColor} bg-white shadow-2xl relative`;

    
        const content = document.getElementById('modal_content');
        content.innerHTML = `
            <div class="">
                <h2 class="font-bold text-2xl text-[#1F2937]">${issue.title}</h2>

                <div class="flex items-center gap-3 mt-4">
                    <span class="badge px-2 py-1.5 ${statusBadge} font-bold">${issue.status}</span>
                    <span class="font-normal text-sm text-[#1F2937]">
                    <span class="w-1 h-1 border border-[#64748B] bg-[#64748B] text-center rounded-full inline-block"></span>
                    Opened by ${issue.author.trim()||'Unknown'}</span>
                    <span class="text-xs font-normal text-[#64748B]">
                    <span class="w-1 h-1 border border-[#64748B] bg-[#64748B] rounded-full inline-block"></span>
                    ${createDateFormatDate}
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
                        <p class="tfont-normal text-base text-[#64748B]">Assignee</p>
                        <p class="font-semibold text-base text-[#1F2937]">${issue.assignee || 'Not assigned'}</p>
                    </div>
                    <div>
                        <p class="font-normal text-base text-[#64748B]">Priority</p>
                        <p class="font-medium text-white text-xs text-center rounded-full w-[60%] mx-auto py-1.5 px-4 ${priorityClass}">
                            ${priority}
                        </p>
                    </div>
                    <div>
                        <p class=" font-normal text-base text-[#64748B]">Author</p>
                        <p class="font-bold text-xs mt-1">${issue.author || 'Unknown'}</p>
                    </div>
                    <div>
                        <p class=" font-normal text-base text-[#64748B]">updatedAt</p>
                        <p class="font-bold text-xs mt-1">${updatedAtDateFormatDate}</p>
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


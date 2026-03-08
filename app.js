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




/* ================= KONFIGURASI WEBHOOK & BOT ================= */
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1508782082195853333/fcOHObm9YFiRK_VvKRrmBVb-XKfGfSh0Cr3iyfBwyG_36i7q9KexQXgojOllpoMiM6VZ"; 
const TELEGRAM_BOT_TOKEN = "ISI_TOKEN_BOT_TELEGRAM_KAMU";
const TELEGRAM_CHAT_ID = "ISI_CHAT_ID_TELEGRAM_KAMU";

/* ================= LOADING & AUDIO SETUP ================= */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);
});

// Toggle Background Music
const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        bgMusic.play();
        musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
});

/* ================= NAVIGATION LOGIC ================= */
function goToSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });
    const target = document.getElementById(sectionId);
    target.classList.remove('hidden');
    target.classList.add('active');
    window.scrollTo(0, 0);
}

/* ================= MODAL LOGIC ================= */
const modal = document.getElementById('terms-modal');
const modalBody = document.getElementById('modal-body');
const progressBar = document.getElementById('modal-progress');
const btnLanjut = document.getElementById('btn-lanjut-form');

function openModal() {
    modal.classList.add('show');
    // Tombol langsung aktif & progress bar langsung penuh karena validasi scroll dihapus
    btnLanjut.disabled = false;
    btnLanjut.className = 'btn-glowing w-100';
    progressBar.style.width = '100%';
    modalBody.scrollTop = 0;
}

function goToFormFromModal() {
    modal.classList.remove('show');
    goToSection('form-section');
}

/* ================= FORM IMAGE PREVIEW ================= */
const fileInput = document.getElementById('tiktok-ss');
const imagePreview = document.getElementById('image-preview');

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            imagePreview.innerHTML = '';
            imagePreview.style.border = 'none';
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.backgroundImage = 'none';
        imagePreview.innerHTML = '<span>Preview Image</span>';
        imagePreview.style.border = '2px dashed #444';
    }
});

/* ================= FORM SUBMISSION (WEBHOOKS) ================= */
const form = document.getElementById('recruitment-form');
const btnSubmit = document.getElementById('btn-submit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tkUser = document.getElementById('tiktok-user').value;
    const name = document.getElementById('nama').value;
    const age = document.getElementById('umur').value;
    const wa = document.getElementById('whatsapp').value;
    const reason = document.getElementById('alasan').value;
    const file = fileInput.files[0];

    // Mengikuti syarat baru minimal umur 14 tahun
    if (age < 14) {
        alert("Umur pendaftar minimal harus 14 tahun!");
        return;
    }

    const originalBtnText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MENGIRIM DATA...';
    btnSubmit.disabled = true;
    btnSubmit.style.opacity = '0.7';

    const messageContent = `
📢 *PENDAFTARAN GMFK JUNIOR BARU!*
━━━━━━━━━━━━━━━━━━━━━━
🧑 Nama Asli/Panggung : ${name}
🎵 Username TikTok    : ${tkUser}
🎂 Umur               : ${age} Tahun
📱 No WhatsApp        : ${wa}
💬 Alasan Join GMFK   : ${reason}
━━━━━━━━━━━━━━━━━━━━━━
🔥 Semoga berhasil join GMFK JUNIOR FF KIPAS!`;

    try {
        // 1. PROSES KIRIM DISCORD (Dengan pemetaan file form-data yang valid)
        if (DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.includes("http")) {
            const discordData = new FormData();
            
            discordData.append("payload_json", JSON.stringify({
                content: messageContent
            }));
            
            if (file) {
                // Di-append menggunakan parameter array standar API Discord
                discordData.append("files[0]", file, file.name || "screenshot.png");
            }

            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                body: discordData
            });
        }

        // 2. PROSES KIRIM TELEGRAM
        if (TELEGRAM_BOT_TOKEN && !TELEGRAM_BOT_TOKEN.includes("ISI_TOKEN") && TELEGRAM_CHAT_ID) {
            const telegramData = new FormData();
            telegramData.append("chat_id", TELEGRAM_CHAT_ID);
            telegramData.append("caption", messageContent);
            
            if (file) {
                telegramData.append("photo", file);
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: telegramData
                });
            } else {
                telegramData.append("text", messageContent);
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    body: telegramData
                });
            }
        }

        goToSection('success-section');

    } catch (error) {
        console.error('Detail Error:', error);
        alert('Data gagal terkirim. Pastikan Webhook / Token telah diisi dengan benar!');
    } finally {
        btnSubmit.innerHTML = originalBtnText;
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
    }
});

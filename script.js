/* ================= KONFIGURASI WEBHOOK & BOT ================= */

// Webhook Discord (opsional)
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1521486045005353030/PQUDcG9-DiytNbqPmtmC8Qn5S7lVxbM8PTDNDWCjbvQ42HXvg0GsSVlRbdwQNYy5fQyS";

// Telegram Bot
const TELEGRAM_BOT_TOKEN = "8582432667:AAGq6Ixy61ORx9mw0jdF9gm4McH76fwQMmQ";
const TELEGRAM_CHAT_ID = "-1004431295873";

// ============================================================
// LINK GRUP WHATSAPP
// ============================================================
// GANTI dengan link grup WhatsApp GMFK JUNIOR kamu.
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/FhGDk2oAXXIIffJhkmn8Z4?s=cl&p=a&mlu=0&ilr=4";

// Berapa detik setelah pendaftaran berhasil sebelum otomatis
// diarahkan ke grup WhatsApp.
const REDIRECT_DELAY_SECONDS = 5;


/* ================= LOADING & AUDIO SETUP ================= */

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    setTimeout(() => {
        loader.style.opacity = '0';

        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);

    }, 1500);
});


/* ================= MUSIC ================= */

const musicBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

let isMusicPlaying = false;

musicBtn.addEventListener('click', () => {

    if (isMusicPlaying) {

        bgMusic.pause();

        musicBtn.innerHTML =
            '<i class="fas fa-volume-mute"></i>';

    } else {

        bgMusic.play();

        musicBtn.innerHTML =
            '<i class="fas fa-volume-up"></i>';
    }

    isMusicPlaying = !isMusicPlaying;
});


/* ================= NAVIGATION ================= */

function goToSection(sectionId) {

    document.querySelectorAll('.page-section').forEach(sec => {

        sec.classList.remove('active');
        sec.classList.add('hidden');

    });

    const target = document.getElementById(sectionId);

    if (!target) return;

    target.classList.remove('hidden');
    target.classList.add('active');

    window.scrollTo(0, 0);
}


/* ================= MODAL ================= */

const modal = document.getElementById('terms-modal');
const modalBody = document.getElementById('modal-body');
const progressBar = document.getElementById('modal-progress');
const btnLanjut = document.getElementById('btn-lanjut-form');


function openModal() {

    modal.classList.add('show');

    btnLanjut.disabled = false;

    btnLanjut.className =
        'btn-glowing w-100';

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


fileInput.addEventListener('change', function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function (e) {

            imagePreview.style.backgroundImage =
                `url(${e.target.result})`;

            imagePreview.innerHTML = '';

            imagePreview.style.border = 'none';
        };

        reader.readAsDataURL(file);

    } else {

        imagePreview.style.backgroundImage = 'none';

        imagePreview.innerHTML =
            '<span>Preview Image</span>';

        imagePreview.style.border =
            '2px dashed #444';
    }
});


/* ============================================================
   FORM SUBMISSION
   ============================================================ */

const form = document.getElementById('recruitment-form');
const btnSubmit = document.getElementById('btn-submit');

let registrationData = '';
let redirectTimer = null;


form.addEventListener('submit', async (e) => {

    e.preventDefault();


    /* ================= AMBIL DATA ================= */

    const tkUser =
        document.getElementById('tiktok-user').value.trim();

    const name =
        document.getElementById('nama').value.trim();

    const age =
        document.getElementById('umur').value.trim();

    const wa =
        document.getElementById('whatsapp').value.trim();

    const reason =
        document.getElementById('alasan').value.trim();

    const file =
        fileInput.files[0];


    /* ================= VALIDASI UMUR ================= */

    if (Number(age) < 14) {

        alert(
            "Umur pendaftar minimal harus 14 tahun!"
        );

        return;
    }


    /* ================= BUTTON LOADING ================= */

    const originalBtnText =
        btnSubmit.innerHTML;

    btnSubmit.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> MENGIRIM DATA...';

    btnSubmit.disabled = true;

    btnSubmit.style.opacity = '0.7';


    /* ========================================================
       DATA UNTUK USER
       ======================================================== */

    registrationData =
`PENDAFTARAN GMFK JUNIOR
━━━━━━━━━━━━━━━━━━━━━━
Nama Asli/Panggung : ${name}
Username TikTok    : ${tkUser}
Umur               : ${age} Tahun
No WhatsApp        : ${wa}
Alasan Join GMFK   : ${reason}
━━━━━━━━━━━━━━━━━━━━━━
Saya sudah membaca dan menyetujui RULES GMFK JUNIOR.`;


    /* ========================================================
       DATA UNTUK ADMIN TELEGRAM
       ======================================================== */

    const telegramMessage =
`📢 PENDAFTARAN GMFK JUNIOR BARU!

━━━━━━━━━━━━━━━━━━━━━━
Nama Asli/Panggung : ${name}
Username TikTok    : ${tkUser}
Umur               : ${age} Tahun
No WhatsApp        : ${wa}
Alasan Join GMFK   : ${reason}
━━━━━━━━━━━━━━━━━━━━━━

Data dikirim dari website Recruitment GMFK JUNIOR.`;


    try {


        /* ====================================================
           1. DISCORD WEBHOOK
           ==================================================== */

        if (
            DISCORD_WEBHOOK_URL &&
            DISCORD_WEBHOOK_URL.includes("http")
        ) {

            const discordData =
                new FormData();


            discordData.append(
                "payload_json",
                JSON.stringify({
                    content: telegramMessage
                })
            );


            if (file) {

                discordData.append(
                    "files[0]",
                    file,
                    file.name || "screenshot.png"
                );
            }


            const discordResponse =
                await fetch(
                    DISCORD_WEBHOOK_URL,
                    {
                        method: 'POST',
                        body: discordData
                    }
                );


            if (!discordResponse.ok) {

                throw new Error(
                    'Discord webhook gagal mengirim data.'
                );
            }
        }


        /* ====================================================
           2. TELEGRAM BOT
           ==================================================== */

        if (
            TELEGRAM_BOT_TOKEN &&
            !TELEGRAM_BOT_TOKEN.includes("ISI_TOKEN") &&
            TELEGRAM_CHAT_ID
        ) {


            /* ================= ADA FOTO ================= */

            if (file) {

                const telegramPhotoData =
                    new FormData();


                telegramPhotoData.append(
                    "chat_id",
                    TELEGRAM_CHAT_ID
                );


                telegramPhotoData.append(
                    "caption",
                    telegramMessage
                );


                telegramPhotoData.append(
                    "photo",
                    file
                );


                const telegramResponse =
                    await fetch(
                        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
                        {
                            method: 'POST',
                            body: telegramPhotoData
                        }
                    );


                if (!telegramResponse.ok) {

                    throw new Error(
                        'Telegram gagal mengirim foto/data.'
                    );
                }


            }

            /* ================= TANPA FOTO ================= */

            else {

                const telegramTextData =
                    new FormData();


                telegramTextData.append(
                    "chat_id",
                    TELEGRAM_CHAT_ID
                );


                telegramTextData.append(
                    "text",
                    telegramMessage
                );


                const telegramResponse =
                    await fetch(
                        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                        {
                            method: 'POST',
                            body: telegramTextData
                        }
                    );


                if (!telegramResponse.ok) {

                    throw new Error(
                        'Telegram gagal mengirim data.'
                    );
                }
            }
        }


        /* ====================================================
           PENDAFTARAN BERHASIL
           ==================================================== */

        const copyData =
            document.getElementById('copy-data');


        if (copyData) {

            copyData.value =
                registrationData;
        }


        goToSection(
            'success-section'
        );


        /* ====================================================
           MULAI COUNTDOWN WHATSAPP
           ==================================================== */

        startWhatsappRedirect();


    } catch (error) {

        console.error(
            'Detail Error:',
            error
        );


        alert(
            'Data gagal terkirim. Pastikan Webhook / Token Telegram telah diisi dengan benar!'
        );


    } finally {

        btnSubmit.innerHTML =
            originalBtnText;

        btnSubmit.disabled =
            false;

        btnSubmit.style.opacity =
            '1';
    }

});


/* ============================================================
   COPY DATA PENDAFTARAN
   ============================================================ */

async function copyRegistrationData() {

    const textarea =
        document.getElementById('copy-data');

    const button =
        document.getElementById('copy-data-btn');


    if (!textarea) return;


    try {

        await navigator.clipboard.writeText(
            textarea.value
        );


    } catch (error) {

        /*
         * Fallback untuk browser/WebView
         * yang tidak mendukung Clipboard API.
         */

        textarea.focus();

        textarea.select();

        textarea.setSelectionRange(
            0,
            textarea.value.length
        );

        document.execCommand('copy');
    }


    if (button) {

        button.innerHTML =
            '<i class="fas fa-check"></i> DATA TERSALIN';


        setTimeout(() => {

            button.innerHTML =
                '<i class="fas fa-copy"></i> SALIN DATA';

        }, 2000);
    }
}


/* ============================================================
   JOIN GRUP WHATSAPP
   ============================================================ */

async function joinWhatsappGroup() {

    /*
     * Salin data terlebih dahulu.
     * Jadi saat user masuk grup,
     * datanya sudah ada di clipboard.
     */

    await copyRegistrationData();


    if (
        !WHATSAPP_GROUP_LINK ||
        WHATSAPP_GROUP_LINK.includes("ISI_LINK")
    ) {

        alert(
            'Link grup WhatsApp belum diisi. Silakan isi WHATSAPP_GROUP_LINK di script.js.'
        );

        return;
    }


    /*
     * Membuka link WhatsApp.
     * Tidak mengirim data otomatis ke WhatsApp.
     */

    window.location.href =
        WHATSAPP_GROUP_LINK;
}


/* ============================================================
   AUTO REDIRECT WHATSAPP
   ============================================================ */

function startWhatsappRedirect() {

    const redirectInfo =
        document.getElementById('redirect-info');


    if (!redirectInfo) return;


    let seconds =
        REDIRECT_DELAY_SECONDS;


    redirectInfo.textContent =
        `Kamu akan diarahkan otomatis ke grup WhatsApp dalam ${seconds} detik. Salin data terlebih dahulu.`;


    clearInterval(
        redirectTimer
    );


    redirectTimer =
        setInterval(() => {

            seconds--;


            if (seconds <= 0) {

                clearInterval(
                    redirectTimer
                );


                if (
                    WHATSAPP_GROUP_LINK &&
                    !WHATSAPP_GROUP_LINK.includes("ISI_LINK")
                ) {

                    window.location.href =
                        WHATSAPP_GROUP_LINK;

                } else {

                    redirectInfo.textContent =
                        'Link grup WhatsApp belum diatur oleh admin.';
                }


                return;
            }


            redirectInfo.textContent =
                `Kamu akan diarahkan otomatis ke grup WhatsApp dalam ${seconds} detik. Salin data terlebih dahulu.`;

        }, 1000);
}
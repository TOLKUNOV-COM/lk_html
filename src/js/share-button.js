export default function shareButton() {
    const copyContent = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Content copied to clipboard');

            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);

            return false;
        }
    }

    $(document).on('click', '.share-button', async function (e) {
        e.preventDefault();

        let text = $(this).data('url');

        let result = await copyContent(text);

        if (result) {
            $(this).addClass('share-button_success');

            setTimeout(function () {
                $('.share-button').removeClass('share-button_success');
            }, 2000);
        }
    });
}

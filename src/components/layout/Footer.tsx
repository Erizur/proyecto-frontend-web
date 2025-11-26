import ArtpondoText from "../common/ArtpondLogo";

function Footer() {
    return <>
    <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
    <aside>
        <ArtpondoText
        className="h-12 w-auto"
        style={{
            '--primary': 'var(--color-base-200)',
            '--secondary': 'var(--color-base-content)'

        }}/>
        <sub className="mb-2">Una plataforma para artistas y creativos.</sub>
        <div className="flex flex-wrap gap-2 text-xs opacity-80">
            <a href="#" className="hover:underline">Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:underline">Términos</a>
            <span>•</span>
            <a href="#" className="hover:underline">Reglas</a>
        </div>
        <p>Artpond © {new Date().getFullYear()} - All right reserved by DBP</p>
    </aside>
    </footer>
    </>
}
export default Footer;
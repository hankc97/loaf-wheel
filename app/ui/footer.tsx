const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="h-8 w-full flex items-center justify-center bg-degen-gray-900">
      <div className="text-loaf-white-100 text-xxs">Loaf {year}</div>
    </footer>
  );
};

export default Footer;

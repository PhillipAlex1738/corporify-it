
import { Link } from 'react-router-dom';

const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/" className="bg-corporate-gradient p-2 rounded-lg">
        <h1 className="text-white font-bold text-xl">Corporify It</h1>
      </Link>
    </div>
  );
};

export default HeaderLogo;

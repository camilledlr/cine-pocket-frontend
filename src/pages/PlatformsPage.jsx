import { React, useState } from "react";
import Modale from "../components/Common/Modale";
import { updateFilmPlatforms } from "../services/films";
import { useParams, useLocation, useNavigate, data } from "react-router-dom";
import Form from "../components/Common/Form";
import Checkbox from "../components/Common/Checkbox";
import "../styles/PlatformsPage.css"; // Import CSS file for styling

const PlatformPage = () => {
  const location = useLocation();
  const title = location.state?.title;
  const platformsList = [
    { id: "prime_video", label: "Prime Video" },
    { id: "netflix", label: "Netflix" },
    { id: "disney_plus", label: "Disney +" },
    { id: "arte", label: "Arte" },
    { id: "universciné", label: "Universciné" },
    { id: "france_tv", label: "France TV" },
    { id: "hbo", label: "HBO max" },
    { id: "m6", label: "M6 +" },
    { id: "tf1", label: "TF1 +" },
    { id: "vod", label: "VOD" },
    { id: "no_dispo", label: "Indisponible" },
  ];
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const navigate = useNavigate();
  const { filmId } = useParams();

  const handleCheckboxChange = (platform) => {
    setSelectedPlatforms((prev) => {
      const alreadySelected = prev.some((p) => p.id === platform.id);
      return alreadySelected
        ? prev.filter((p) => p.id !== platform.id)
        : [...prev, platform];
    });
  };

  const handleAddPlatform = async (data) => {
    try {
      const result = await updateFilmPlatforms(filmId, selectedPlatforms);
      if (result && result.message) {
        setTimeout(() => navigate(-1), 500); // ← retour en arrière après 500ms
      }
      return {
        success: true,
        message: result.message || "Dispo modifiée avec succès !",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "❌ Échec de la modif de la dispo.",
      };
    }
  };
  return (
    <div>
      <Modale modaleTitle={title}></Modale>
      <div className="dispo-title">Dispo sur ...</div>
      <Form onSubmit={handleAddPlatform}>
        {platformsList.map((platform) => (
          <Checkbox
            key={platform.id}
            id={platform.id}
            label={platform.label}
            checked={selectedPlatforms.some((p) => p.id === platform.id)}
            onChange={() => handleCheckboxChange(platform)}
          />
        ))}
      </Form>
    </div>
  );
};

export default PlatformPage;

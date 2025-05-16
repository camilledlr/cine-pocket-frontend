import React from 'react';
import Modale from '../components/Common/Modale';
import { addReco } from '../services/films';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Input from '../components/Common/Input';
import Form from '../components/Common/Form';

const RecoPage = () => {
    const location = useLocation();
    const title = location.state?.title;
    const navigate = useNavigate();
    const { filmId } = useParams();

    const handleAddReco = async (data) => {
        try {
          const result = await addReco(filmId, data.reco);
    
          // ✅ On redirige uniquement si tout s’est bien passé
          if (result && result.message) {
            setTimeout(() => navigate(-1), 500); // ← retour en arrière après 500ms
          }
    
          return {
            success: true,
            message: result.message || "✅ Recommandation ajoutée avec succès !"
          };
        } catch (error) {
          return {
            success: false,
            message: error.message || "❌ Échec de l’ajout de la recommandation."
          };
        }
      };
  return (
    <div>
        <Modale modaleTitle={title}>
        <Form onSubmit={handleAddReco}>
        <Input inputId="reco" placeholder="askip il faut voir ce film parce que..."/>
        </Form>
        </Modale>
    </div>
  )
}

export default RecoPage
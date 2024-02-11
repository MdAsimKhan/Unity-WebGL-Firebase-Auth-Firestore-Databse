using FirebaseWebGL.Examples.Utils;
using FirebaseWebGL.Scripts.FirebaseBridge;
using FirebaseWebGL.Scripts.Objects;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace FirebaseWebGL.Examples.Firestore
{
    public class MyFirestoreHandler : MonoBehaviour
    {
        public string collection = "scores";
        public TMP_InputField valueInputField;
        public TextMeshProUGUI outputText;
        public string authScene;

        private void Start()
        {
            if (Application.platform != RuntimePlatform.WebGLPlayer)
                DisplayError("The code is not running on a WebGL build; as such, the Javascript functions will not be recognized.");
        }

        public void SetOrUpdateDocument() => FirebaseFirestore.SetOrUpdateDocument(collection, valueInputField.text, gameObject.name,
            "DisplayInfo", "DisplayErrorObject");

        public void SignOutUser() => FirebaseAuth.SignOutUser(gameObject.name, "LoadAuth", "DisplayErrorObject");

        public void DisplayData(string data)
        {
            outputText.color = outputText.color == Color.green ? Color.blue : Color.green;
            outputText.text = data;
            Debug.Log(data);
        }

        public void DisplayInfo(string info)
        {
            outputText.color = Color.white;
            outputText.text = info;
            Debug.Log(info);
        }

        public void DisplayErrorObject(string error)
        {
            var parsedError = StringSerializationAPI.Deserialize(typeof(FirebaseError), error) as FirebaseError;
            DisplayError(parsedError.message);
        }

        public void DisplayError(string error)
        {
            outputText.color = Color.red;
            outputText.text = error;
            Debug.LogError(error);
        }

        public void LoadAuth() => SceneManager.LoadScene(authScene);
    }
}
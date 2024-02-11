mergeInto(LibraryManager.library, {

    SetDocument: function (collection, documentId, score, objectName, callback, fallback) {
        var parsedCollection = Pointer_stringify(collection);
        var parsedDocumentId = Pointer_stringify(documentId);
        var parsedValue = Pointer_stringify(score);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            firebase.firestore().collection(parsedCollection).doc(parsedDocumentId).set(JSON.parse(parsedValue)).then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: document " + documentId + " was set");
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    SetOrUpdateDocument: function (collection, score, objectName, callback, fallback) {
        var parsedCollection = Pointer_stringify(collection);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);
        var parsedScore = parseInt(Pointer_stringify(score)); // parse score as integer

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var email = user.email.replace(/[^a-zA-Z0-9]/g, '_'); // replace all special characters with '_'
                var docRef = firebase.firestore().collection(parsedCollection).doc(email);

                docRef.get().then(function(doc) {
                    // update
                    if (doc.exists && score != null) {
                        // If the document exists, update the 'score' field
                        docRef.update({
                            "score": parsedScore
                        }).then(function() {
                            unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: document " + user.email + " was updated");
                        }).catch(function(error) {
                            console.error(error); // log the error to the console
                            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                        });
                        score = null;
                    } else {
                        // set
                        // If the document does not exist, set the documentId to the user id and add it
                        if(score != null) {
                            docRef.set({
                                "score": parsedScore
                            }).then(function() {
                                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: document " + user.email + " was set");
                            }).catch(function(error) {
                                console.error(error); // log the error to the console
                                unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                            });
                            score = null;
                        }
                    }
                }).catch(function(error) {
                    console.error(error); // log the error to the console
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });
            } else {
                // No user is signed in.
                unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, "Error: no user is signed in");
            }
        });
    },




    GetDocument: function (collectionPath, documentId, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {
            firebase.firestore().collection(parsedPath).doc(parsedId).get().then(function (doc) {

                if (doc.exists) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, JSON.stringify(doc.data()));
                } else {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "null");
                }
            }).catch(function(error) {
                unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
            });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    GetDocumentsInCollection: function (collectionPath, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {
            firebase.firestore().collection(parsedPath).get().then(function (querySnapshot) {

                var docs = {};
                querySnapshot.forEach(function(doc) {
                    docs[doc.id] = doc.data();
                });

                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, JSON.stringify(docs));
            }).catch(function(error) {
                unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
            });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    AddDocument: function (collectionPath, value, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedValue = Pointer_stringify(value);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            firebase.firestore().collection(parsedPath).add(JSON.parse(parsedValue)).then(function(unused) {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: document added in collection " + parsedPath);
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    UpdateDocument: function (collectionPath, documentId, value, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedValue = Pointer_stringify(value);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            firebase.firestore().collection(parsedPath).doc(parsedId).update(JSON.parse(parsedValue)).then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: document " + parsedId + " was updated");
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    DeleteDocument: function (collectionPath, documentId, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            firebase.firestore().collection(parsedPath).doc(parsedId).delete().then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: document " + parsedId + " was deleted");
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    DeleteField: function (collectionPath, documentId, field, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedField = Pointer_stringify(field);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            var value = {};
            value[parsedField] = firebase.firestore.FieldValue.delete();

            firebase.firestore().collection(parsedPath).doc(parsedId).update(value).then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: field " + parsedField + " was deleted");
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    AddElementInArrayField: function (collectionPath, documentId, field, value, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedField = Pointer_stringify(field);
        var parsedValue = Pointer_stringify(value);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            var value = {};
            value[parsedField] = firebase.firestore.FieldValue.arrayUnion(JSON.parse(parsedValue));

            firebase.firestore().collection(parsedPath).doc(parsedId).update(value).then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: element " + parsedValue + " was added in " + parsedField);
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    RemoveElementInArrayField: function (collectionPath, documentId, field, value, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedField = Pointer_stringify(field);
        var parsedValue = Pointer_stringify(value);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            var value = {};
            value[parsedField] = firebase.firestore.FieldValue.arrayRemove(JSON.parse(parsedValue));

            firebase.firestore().collection(parsedPath).doc(parsedId).update(value).then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: element " + parsedValue + " was removed in " + parsedField);
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    IncrementFieldValue: function (collectionPath, documentId, field, increment, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedField = Pointer_stringify(field);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            var value = {};
            value[parsedField] = firebase.firestore.FieldValue.increment(increment);

            firebase.firestore().collection(parsedPath).doc(parsedId).update(value).then(function() {
                unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: incremented " + parsedField + " by " + increment);
            })
                .catch(function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    ListenForDocumentChange: function (collectionPath, documentId, includeMetadataChanges, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            if (typeof firestorelisteners === 'undefined') firestorelisteners = {};

            this.firestorelisteners[parsedPath + "/" + parsedId] = firebase.firestore().collection(parsedPath).doc(parsedId)
                .onSnapshot({
                    includeMetadataChanges: (includeMetadataChanges == 1)
                }, function(doc) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, JSON.stringify(doc.data()));
                }, function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    StopListeningForDocumentChange: function (collectionPath, documentId, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedId = Pointer_stringify(documentId);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            if (typeof firestorelisteners === 'undefined') firestorelisteners = {};

            this.firestorelisteners[parsedPath + "/" + parsedId]();
            unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: listener was removed");
        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    ListenForCollectionChange: function (collectionPath, includeMetadataChanges, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            if (typeof firestorelisteners === 'undefined') firestorelisteners = {};

            this.firestorelisteners[parsedPath + "/collection/"] = firebase.firestore().collection(parsedPath)
                .onSnapshot({
                    includeMetadataChanges: (includeMetadataChanges == 1)
                }, function(querySnapshot) {

                    var docs = {};
                    querySnapshot.forEach(function(doc) {
                        docs[doc.id] = doc.data();
                    });

                    unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, JSON.stringify(docs));

                }, function(error) {
                    unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
                });

        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    },

    StopListeningForCollectionChange: function (collectionPath, objectName, callback, fallback) {
        var parsedPath = Pointer_stringify(collectionPath);
        var parsedObjectName = Pointer_stringify(objectName);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try {

            if (typeof firestorelisteners === 'undefined') firestorelisteners = {};

            this.firestorelisteners[parsedPath + "/collection/"]();
            unityInstance.Module.SendMessage(parsedObjectName, parsedCallback, "Success: listener was removed");
        } catch (error) {
            unityInstance.Module.SendMessage(parsedObjectName, parsedFallback, JSON.stringify(error, Object.getOwnPropertyNames(error)));
        }
    }
});
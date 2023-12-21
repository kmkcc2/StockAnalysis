import jwt
from flask import Flask, request, jsonify
import config
from functools import wraps

def verifyToken(f):
     @wraps(f)
     def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({
                "message": "Authentication Token is missing!",
            }), 401
        try:
            data=jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
        except Exception as e:
            return jsonify({
                "message": "Token is invalid",
                "error": str(e)
        }), 403
        return f(*args, **kwargs)
     return decorated
def verifyAdminToken(f):
     @wraps(f)
     def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({
                "message": "Authentication Token is missing!",
            }), 401
        try:
            data=jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
            if data["is_active"] == False:
                return jsonify({
                "message": "Unauthorized"
            }), 403
            if data["role"] != 'admin':
                return jsonify({
                "message": "Permission denied."
            }), 403
        except Exception as e:
            return jsonify({
                "message": "Token is invalid",
                "error": str(e)
        }), 403
        return f(*args, **kwargs)
     return decorated
def verifyPayment(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({
                "message": "Authentication Token is missing!",
            }), 401
        try:
            data=jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
            if data["is_active"] == False:
                return jsonify({
                "message": "unpayed"
            }), 403
        except Exception as e:
            return jsonify({
                "message": "Token is invalid",
        }), 403
        return f(*args, **kwargs)
    return decorated
import random
import time
from flask.json import jsonify
from psycopg2 import IntegrityError
from sqlalchemy import select, insert, update, or_, desc, delete
from flask import request, Response
import hashlib
from flask.json import jsonify
from models.user import User, db
from models.user_reset_token import User_reset_token, db as db_token
import re
import jwt
import datetime
import config
from middleware import verifyAdminToken, verifyToken

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

# Define a function for
# for validating an Email
def check(email):
    # pass the regular expression
    # and the string into the fullmatch() method
    if(re.fullmatch(regex, email)):
        return True
    else:
        return False
def encrypt(password):
    sha_signature = \
        hashlib.sha256(password.encode()).hexdigest()
    return sha_signature
@verifyAdminToken
def get_all():
    stmt = select([User.id, User.email, User.is_active, User.role]).select_from(User)
    res = db.session.execute(stmt)
    data = []
    for row in res:
        data.append({'id': row.id, 'email': row.email, 'isActive': row.is_active, 'role': row.role})
    return jsonify(data)
@verifyToken
def get_one(user_id):
    token = request.headers["Authorization"].split(" ")[1]
    data=jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
    if data['role'] == 'user':
        if int(data['id']) != int(user_id):
            print(data['id'])
            print(user_id)
            return {"message":"unathorized"}, 403

    stmt = select([User.id, User.email, User.is_active, User.role]).select_from(User).where(User.id == user_id)
    res = db.session.execute(stmt)
    data = []
    for row in res:
        data.append({'id': row.id, 'email': row.email, 'isActive': row.is_active, 'role': row.role})
    if data.__len__() == 0:
        return {"message": "user not found"}, 404
    return jsonify(data)
@verifyToken
def patch_one(user_id):
    payload = request.get_json()
    emailUpdate = True
    passwordUpdate = True
    roleUpdate = True
    isActiveUpdate = True
    stmt = select([User.id, User.email, User.is_active, User.role]).select_from(User).where(User.id == user_id)
    res = db.session.execute(stmt)
    data = []
    for row in res:
        data.append({'id': row.id, 'email': row.email, 'isActive': row.is_active, 'role': row.role})
    if data.__len__() == 0:
        return {"message": "user not found"}, 404

    try:
        payload['email']
        stmt = update(User).where(User.id == user_id).values(email=payload['email'])
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        excType = type(e).__name__
        if excType == 'IntegrityError':
            return {"message": "Email already in use."}, 400
        emailUpdate = False

    try:
        payload['password']
        stmt = update(User).where(User.id == user_id).values(password=encrypt(payload['password']))
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        excType = type(e).__name__
        print(excType)
        passwordUpdate = False

    try:
        payload['role']
        stmt = update(User).where(User.id == user_id).values(role=payload['role'])
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        excType = type(e).__name__
        print(excType)
        roleUpdate = False

    try:
        payload['isActive']
        stmt = update(User).where(User.id == user_id).values(is_active=bool(payload['isActive']))
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        excType = type(e).__name__
        print(excType)
        isActiveUpdate = False

    if not passwordUpdate and not emailUpdate and not roleUpdate and not isActiveUpdate:
        return jsonify({"message": "Invalid credentials"}), 400
    if passwordUpdate or emailUpdate or roleUpdate or isActiveUpdate:
        return jsonify({"message": "Update successful"}), 200
def login():
    payload = request.get_json()
    try:
        payload['email']
    except:
            return {"message": "email field is required"}, 400
    try:
        payload['password']
    except:
        return {"message": "password field is required"}, 400

    stmt = select([User.id, User.email, User.password, User.is_active, User.role]).select_from(User).where(User.email == payload['email'])
    res = db.session.execute(stmt)
    data = []
    for row in res:
        data.append({'id': row.id, 'email': row.email, 'password': row.password, 'is_active': row.is_active, 'role': row.role})
    if data.__len__() == 0:
        return {"message": "Invalid user email"}, 401
    elif data[0]['password'] != encrypt(payload['password']):
        return {"message": "Invalid user password"}, 401
    token = jwt.encode({'email': data[0]['email'], 'is_active': data[0]['is_active'], 'role': data[0]['role'], 'id': data[0]['id'],
                         'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120)},
                          config.SECRET_KEY)
    return jsonify({'token': token}), 200
def register():
    payload = request.get_json()
    try:
        payload['email']
    except:
            return {"message": "email field is required"}, 400
    try:
        payload['password']
    except:
        return {"message": "password field is required"}, 400
    if check(payload['email']):
        try:
            stmt = (insert(User).values(email=payload['email'], password=encrypt(payload['password']), is_active=True, role='user')).returning(User.id)
            res = db.session.execute(stmt)
            db.session.commit()
            db.session.close()
            id = ''
            for row in res:
                id = row.id
            return {"message": "User created successfuly.", "id": id}, 201
        except Exception as e:
            excType = type(e).__name__
            if excType == 'IntegrityError':
                return {"message": "Email already in use."}, 400
            else:
                print(e)
                return {"message": "Oooopsie"}, 500
    else:
        return {"message": "Email field must be an actual email address."}, 400

@verifyToken
def find_match(pattern):
    token = request.headers["Authorization"].split(" ")[1]
    data=jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
    if data['role'] != 'admin':
        return {"message":"unathorized"}, 403

    stmt = select([User.id, User.email, User.is_active, User.role]).select_from(User).where(or_(User.email.like('%'+pattern+'%'), User.role.like('%'+pattern+'%')))
    print(stmt)
    res = db.session.execute(stmt)
    data = []
    for row in res:
        data.append({'id': row.id, 'email': row.email, 'isActive': row.is_active, 'role': row.role})
    if data.__len__() == 0:
        return {"message": "user not found"}, 404
    return jsonify(data)
def generate_reset_token():
    payload = request.get_json()
    try:
        payload['email']
    except:
        return {"message": "Email is missing"}, 400
    if check(payload['email']):
        try:
            stmt = select([User.id]).select_from(User).where(User.email == payload['email'])
            res = db_token.session.execute(stmt)
            data = []
            for row in res:
                data.append({'id': row[0]})
            if data.__len__() == 0:
                return {"message": "User not found"}, 404
            resetToken = random.getrandbits(128)
            ts = int(time.time()) + 3600
            stmt = (insert(User_reset_token).values(user_id=data[0]['id'], token=str(resetToken), token_expire=ts))
            db_token.session.execute(stmt)
            db_token.session.commit()
        except Exception as e:
            excType = type(e).__name__
            print(excType + ": " + str(e))
            return {"message": "Oooopsie"}, 500

        return {"token": str(resetToken), "id": data[0]['id']}, 201
    else:
        return {"message": "Email field must be an actual email address."}, 400
def password_reset():
    payload = request.get_json()
    try:
        payload['token']
    except:
            return {"message": "Token is missing"}, 400
    try:
        payload['password']
    except:
        return {"message": "password field is required"}, 400
    try:
        payload['id']
    except:
        return {"message": "id field is required"}, 400
    try:
        stmt = select([User_reset_token.token, User_reset_token.token_expire]).select_from(User_reset_token).where(User_reset_token.user_id == payload['id']).order_by(desc(User_reset_token.id))
        res = db_token.session.execute(stmt)
        data = []
        for row in res:
            data.append({'token': row.token, 'token_expire': row.token_expire})
        if data.__len__() == 0:
            return {"message": "User not found"}, 404
        elif data[0]['token_expire'] < int(time.time()):
            return {"message": "Token expired"}, 400
        elif data[0]['token'] == payload['token']:
            try:
                stmt = update(User).where(User.id == payload['id']).values(password=encrypt(payload['password']))
                db.session.execute(stmt)
                db.session.commit()
            except Exception as e:
                return {"message": "Couldn't update users password."}, 500
        else:
            return {"message": "Invalid token"}, 400
    except Exception as e:
        excType = type(e).__name__
        return {"message": "Oooopsie "+excType+" "+str(e)}, 500

    return {"message": "User's password updated."}, 200
@verifyToken
def deleteUser(user_id):
    token = request.headers["Authorization"].split(" ")[1]
    data=jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
    if data['role'] == 'user':
        if int(data['id']) != int(user_id):
            print(data['id'])
            print(user_id)
            return {"message":"unathorized"}, 403

    stmt = delete(User).where(User.id == user_id)
    db.session.execute(stmt)
    db.session.commit()
    db.session.close()
    return jsonify({}), 204
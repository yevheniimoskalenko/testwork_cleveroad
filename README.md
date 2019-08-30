Используя Node.js разработать RESTful API, позволяющее работать с товарами.

Пользователь регистрируется, и получает возможность разместить объявление о продаже товара, как на OLX

Основной функционал:

- --Регистрация
- --Авторизация
- --Получение данных текущего пользователя
- --Создание/удаление товара авторизованным пользователем
- --Изменение данных о товаре  авторизованным пользователем
- --Загрузка изображения товара

В качестве базы данных использовать MySQL

Ниже даны примеры эндпоинтов, запросы на сервер, и возвращаемые модели.

    **Обратите внимание:** в тестовом задание необходимо реализовать только     back-end

**API**

1. **1.**** Login user**

**Request:**

POST _/api/login_ Body:

{

&quot;email&quot;: [&quot;e](mailto:email@example.com)m[ail@example.com](mailto:email@example.com)&quot;,

&quot;password&quot;: &quot;qwerty&quot;

}

# **Responses:**

**200, OK**

Body:

{

&quot;token&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

}

# **422,**  **Unprocessable Entity**

Body: [

{

&quot;field&quot;:&quot;password&quot;,

&quot;message&quot;:&quot;Wrong email or password&quot;

},

]



**2. Register**

# **Request:**

POST _/api/registe_r

Body:

{

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, // optional

&quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;,

&quot;password&quot;:&quot;qwerty&quot;,

}

# **Responses:**

# **200, OK**

Body:

{

&quot;token&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

}

# **422,**  **Unprocessable Entity**

Body: [

{

&quot;field&quot;:&quot;current\_password&quot;,

&quot;message&quot;:&quot;Wrong current password&quot;

},

]



**3. Get current user**

# **Request:**

GET _/api/me_

Headers:

{

&quot;Authorization&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

}

# **Responses:**

**200, OK**

Body:

{

&quot;id&quot;: 1,

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, &quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;

}

# **401,**  **Unauthorized**

Body: empty



**4. Get items list**

# **Request:**

GET _/api/items_

# **Responses**

# **200, OK**

[

{

&quot;id&quot;: 1,

&quot;created\_at&quot;: \&lt;timestamp in seconds\&gt;,

&quot;title&quot;: &quot;Notebook&quot;,

&quot;price&quot;: 5500.00,

  &quot;image&quot;: [&quot;ht](http://example.com/images/)t[p://example.com/images/](http://example.com/images/)/\*.jpg&quot;,

   &quot;user\_id&quot;: 12,

&quot;user&quot;: {

&quot;id&quot;: 1,

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, &quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;

}

}

]

**5. Get item by ID**

# **Request:**

GET _/api/items/\&lt;id\&gt;_

# **Responses:**

**200, OK**

Body:

{

&quot;id&quot;: 1,

&quot;created\_at&quot;: \&lt;timestamp in seconds\&gt;,

&quot;title&quot;: &quot;Notebook&quot;,

&quot;price&quot;: 5500.00,

&quot;image&quot;: [ht](http://example.com/images/)t[p://example.com/images/](http://example.com/images/)\*\*/\*.jpg&quot;,

&quot;user\_id&quot;: 12,

&quot;user&quot;: {

&quot;id&quot;: 1,

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, &quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;

}

}



# **404, Not found**

Body: empty

**6. Update item**

# **Request:**

PUT /api/items/\&lt;id\&gt; Headers:

{

&quot;Authorization&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

}

Body:

{

&quot;title&quot;: &quot;Notebook&quot;, //optional

&quot;price&quot;: 5500.00, //optional

}

# **Responses:**

**200, OK**

Body:

{

&quot;id&quot;: 1,

&quot;created\_at&quot;: \&lt;timestamp in seconds\&gt;,

&quot;title&quot;: &quot;Notebook&quot;,

&quot;price&quot;: 5500.00,

&quot;image&quot;: [&quot;ht](http://example.com/images/)t[p://example.com/images/](http://example.com/images/)\*\*/\*.jpg&quot;, &quot;user\_id&quot;: 12,

&quot;user&quot;: {

&quot;id&quot;: 1,

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, &quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;

}

}



# **422,**  **Unprocessable Entity**

[

{

&quot;field&quot;:&quot;title&quot;,

&quot;message&quot;:&quot;Title should contain at least 3 characters&quot;

}]

# **404, Not found**

Body: empty

# **403, Forbidden**

Body: empty

# **401,**  **Unauthorized**

Body: empty

#

**7. Delete item**

# **Request:**

DELETE _/api/items/\&lt;id\&gt;_

Headers

{

&quot;Authorization&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

}

# **Responses:**

**200, OK**

Body: empty

# **404, Not found**

Body: empty

# **403, Forbidden**

Body: empty

# **401,**  **Unauthorized**

Body: empty



#

**8. Create item**

# **Request:**

POST _/api/items_

Headers:

{

&quot;Authorization&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

}

Body:

{

&quot;title&quot;: &quot;Notebook&quot;, //required

&quot;price&quot;: 5500.00, //required

}



Responses:

# **200, OK**

Body

{

&quot;id&quot;: 1,

&quot;created\_at&quot;: \&lt;timestamp in seconds\&gt;,

&quot;title&quot;: &quot;Notebook&quot;, &quot;price&quot;: 5500.00,

&quot;image&quot;: [&quot;ht](http://example.com/images/)t[p://example.com/images/](http://example.com/images/)\*\*/\*.jpg&quot;,

&quot;user\_id&quot;: 12,

&quot;user&quot;: {

&quot;id&quot;: 1,

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, &quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;

}

}

# **422,**  **Unprocessable Entity**

[

{

&quot;field&quot;:&quot;title&quot;,

&quot;message&quot;:&quot;Title is required&quot;

},

...

]

# **404, Not found**

Body: empty

# **403, Forbidden**

Body: empty

# **401, Unauthorized**

Body: empty



**9. Upload item image**

# **Request:**

POST /api/items/\&lt;id\&gt;/images

Headers:

{

&quot;Authorization&quot;: &quot;3f5uh29fh3kjhpx7tyuioiugfvdfr9j8wi6onjf8&quot;

&quot;Content-Type&quot;: &quot;multipart/form-data&quot;

}

Body:

file=\&lt;file\&gt;

# **Responses:**

200, OK

Body:

{

&quot;id&quot;: 1,

&quot;created\_at&quot;: \&lt;timestamp ineconds\&gt;,

&quot;title&quot;: &quot;Notebook&quot;,

 &quot;price&quot;: 5500.00,

&quot;image&quot;: [&quot;ht](http://example.com/images/)t[p://example.com/images/](http://example.com/images/)\*\*/\*.jpg&quot;,

&quot;user\_id&quot;: 12,

&quot;user&quot;: {

&quot;id&quot;: 1,

&quot;phone&quot;: &quot;+380xxxxxxxxx&quot;, &quot;name&quot;: &quot;Alex&quot;,

&quot;email&quot;: [&quot;alex@mai](mailto:alex@mail.com)l[.com](mailto:alex@mail.com)&quot;

}

}

# **422,**  **Unprocessable Entity**

 [

{

&quot;field&quot;:&quot;image&quot;,

&quot;message&quot;:&quot;The file {file} is too big. &quot;

},

...

]

# **404, Not found**

Body: empty

# **403, Forbidden**

Body: empty

# **401, Unauthorized**

Body: empty


<template>
    <nav class="navbar navbar-expand-lg navbar-light sticky-top">
    <a class="navbar-brand" href="#">&nbsp; 标注平台</a>
    <ul class="navbar-nav">
        <li class="nav-item active">
            <router-link
                to="/home"
                custom
                v-slot="{ navigate }"
                >
                <a
                class="nav-link"
                href=""
                @click="navigate"
                >
                Home
                </a>
            </router-link>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
        </li>
    </ul>
    </nav>

</template>

<style>
.navbar {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    border-radius: 1px;
}
</style>
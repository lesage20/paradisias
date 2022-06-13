<template>
  <q-card>
    <q-toolbar class="q-mt-lg">
      <q-toolbar-title class="text-center">
        Rapport de la journée ( {{ new Date().toLocaleDateString() }} )
      </q-toolbar-title>
    </q-toolbar>
    <q-card-section>
      <div class="text-grey-10">
        Aujourd'hui nous avons eu {{ todayLocationCount }} locations qui ont
        généré {{ todayLocationsRevenue }} FCFA de revenue brut, avec
        {{ todayDepenseCount }} dépense{{ todayDepenseCount > 1 ? "s" : "" }}
        qui a couté
        {{ todayDepensesAmount }} FCFA, l'estimation des bénéfices engendré
        aujourd'hui s'élève à
        {{ todayLocationsRevenue - todayDepensesAmount }} FCFA. <br />
        Ci dessous les tableau de locations d'aujourd'hui.
      </div>
      <div class="q-py-md">
        <q-table
          flat
          bordered
          :rows="todayLocations"
          :columns="columns"
          hide-pagination
        >
          <template #top>
            <div class="row justify-center text-center">
              <div class="col">
                <p class="text-center text-subtitle1">
                  Tableau récapitulatif des locations de ce jour
                </p>
              </div>
            </div>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

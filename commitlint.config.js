module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Yeni özellik
        'fix', // Hata düzeltme
        'docs', // Dokümantasyon
        'style', // Kod formatı
        'refactor', // Refactor
        'perf', // Performans
        'test', // Test
        'build', // Build sistem
        'ci', // CI yapılandırma
        'chore', // Diğer değişiklikler
        'revert', // Geri alma
      ],
    ],
    'subject-case': [0],
  },
}
